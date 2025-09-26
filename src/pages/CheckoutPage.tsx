import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Check, Truck, Shield, Lock } from "lucide-react";
import { formatCurrency, setLocalStorage } from "../lib/utils";
import { CartItem } from "../types/cart";
import { clearCart, selectCartItems } from "../store/slices/cartSlice";
import { addOrder } from "../store/slices/ordersSlice";
import { AppDispatch } from "../store";
import { Button } from "../components/ui/button";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  saveInfo: boolean;
  paymentMethod: "credit-card" | "paypal" | "apple-pay";
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
};

const CheckoutPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  // Removed unused variable 'subtotal'
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Removed unused variables 'shipping' and 'tax'
  // Removed unused variable 'orderTotal'

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      saveInfo: false,
      paymentMethod: "credit-card",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: FormData) => {
    // Step validation + navigation
    if (activeStep === 1) {
      // Validate shipping/contact fields
      const ok = await trigger([
        "email",
        "firstName",
        "lastName",
        "address",
        "city",
        "state",
        "zipCode",
        "phone",
      ]);
      if (!ok) return;
      setActiveStep(2);
      return;
    }

    if (activeStep === 2) {
      // Validate payment depending on method
      const method = data.paymentMethod || watch("paymentMethod");
      if (method === "credit-card") {
        const ok = await trigger([
          "cardNumber",
          "cardName",
          "cardExpiry",
          "cardCvv",
        ]);
        if (!ok) return;
      }
      setActiveStep(3);
      return;
    }

    // Finalize order (activeStep === 3)
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Create order from checkout data
      const orderData = {
        items: items.map((item: CartItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "/images/logo.png",
        })),
        total: items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0),
        shippingAddress: {
          name: `${data.firstName} ${data.lastName}`,
          street: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        paymentMethod:
          data.paymentMethod === "credit-card"
            ? `Visa ending in ${data.cardNumber?.slice(-4) || "****"}`
            : data.paymentMethod === "paypal"
              ? "PayPal"
              : "Apple Pay",
      };

      // Add order to store
      dispatch(addOrder(orderData));

      // Optionally save shipping info
      if (data.saveInfo) {
        try {
          setLocalStorage("shippingInfo", {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            apartment: data.apartment,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            phone: data.phone,
          });
        } catch (err) {
          // ignore localStorage errors
        }
      }

      // Clear cart and show success
      dispatch(clearCart());
      setOrderComplete(true);
    } catch (err) {
      console.error("Order submission failed", err);
      // Could set an error state here and show to user
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      navigate(-1);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="bg-gradient-to-br from-white/70 via-green-50/60 to-green-100/40 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="glass-card backdrop-blur-lg shadow-2xl p-8 rounded-xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              There are no items in your cart to checkout.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-green-500 via-green-400 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
            >
              <Link
                to="/products"
                className="flex w-full items-center justify-center"
              >
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="bg-gradient-to-br from-white/70 via-green-50/60 to-green-100/40 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center glass-card backdrop-blur-lg shadow-2xl p-8 rounded-xl">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Order Placed Successfully!
            </h1>
            <p className="mt-4 text-base text-gray-600">
              Thank you for your order. We've received it and are processing it
              now. You'll receive an email confirmation shortly.
            </p>
            <div className="mt-8">
              <Button
                asChild
                className="mr-4 bg-gradient-to-r from-green-500 via-green-400 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
              >
                <Link to="/orders" className="flex items-center justify-center">
                  View Order Status
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  to="/products"
                  className="flex items-center justify-center"
                >
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/70 via-green-50/60 to-green-100/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Checkout
          </h1>
          {/* Progress Steps */}
          <div className="mt-8">
            <nav aria-label="Progress">
              <ol className="flex items-center">
                {["Shipping", "Payment", "Review"].map((step, index) => (
                  <li
                    key={step}
                    className={`${index !== 0 ? "w-full" : ""} relative`}
                  >
                    {index !== 0 && (
                      <div
                        className="absolute top-4 -left-1/2 w-full h-0.5 bg-gradient-to-r from-green-400 via-green-200 to-green-600"
                        aria-hidden="true"
                      >
                        <div
                          className={`h-full ${activeStep > index ? "bg-green-600" : "bg-gray-200"}`}
                          style={{ width: activeStep > index ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                    <div className="group flex flex-col items-center">
                      <span
                        className={`flex items-center justify-center h-8 w-8 rounded-full glass-card backdrop-blur-lg shadow-lg ${
                          activeStep > index + 1
                            ? "bg-green-600 text-white"
                            : activeStep === index + 1
                              ? "border-2 border-green-600 bg-white text-green-600"
                              : "border-2 border-gray-300 bg-white text-gray-500"
                        }`}
                      >
                        {activeStep > index + 1 ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <span className="text-sm font-medium">
                            {index + 1}
                          </span>
                        )}
                      </span>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          activeStep >= index + 1
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16"
          >
            {/* Left column - Form */}
            <div className="lg:col-span-7">
              {/* Shipping Information */}
              {activeStep === 1 && (
                <div className="glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl p-6 mb-8 rounded-xl border border-white/30">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">
                    Contact & Shipping
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email",
                          },
                        })}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${errors.email ? "border-red-500" : ""}`}
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <input
                          type="text"
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${errors.firstName ? "border-red-500" : ""}`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <input
                          type="text"
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${errors.lastName ? "border-red-500" : ""}`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        {...register("address", {
                          required: "Address is required",
                        })}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${errors.address ? "border-red-500" : ""}`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        {...register("apartment")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          {...register("city", {
                            required: "City is required",
                          })}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${errors.city ? "border-red-500" : ""}`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          {...register("state", {
                            required: "State is required",
                          })}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${errors.state ? "border-red-500" : ""}`}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ZIP
                        </label>
                        <input
                          type="text"
                          {...register("zipCode", {
                            required: "ZIP code is required",
                          })}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${errors.zipCode ? "border-red-500" : ""}`}
                        />
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.zipCode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        {...register("phone", {
                          required: "Phone number is required",
                        })}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${errors.phone ? "border-red-500" : ""}`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("saveInfo")}
                        id="saveInfo"
                        className="h-4 w-4 text-green-600"
                      />
                      <label
                        htmlFor="saveInfo"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Save this information for next time
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {/* Payment Information */}
              {activeStep === 2 && (
                <div className="glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl p-6 mb-8 rounded-xl border border-white/30">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center">
                        <input
                          id="credit-card"
                          type="radio"
                          value="credit-card"
                          className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                          defaultChecked
                          {...register("paymentMethod", { required: true })}
                        />
                        <label
                          htmlFor="credit-card"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Credit Card
                        </label>
                      </div>

                      {paymentMethod === "credit-card" && (
                        <div className="mt-4 space-y-4 pl-7">
                          <div>
                            <label
                              htmlFor="cardNumber"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Card number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${
                                errors.cardNumber ? "border-red-500" : ""
                              }`}
                              {...register("cardNumber", {
                                required: "Card number is required",
                                pattern: {
                                  value: /^[0-9\s]{13,19}$/,
                                  message: "Invalid card number format",
                                },
                                validate: {
                                  luhn: (value: string) => {
                                    const cleanValue = value.replace(/\s/g, "");
                                    if (cleanValue.length < 13)
                                      return "Card number too short";

                                    // Luhn algorithm validation
                                    let sum = 0;
                                    let shouldDouble = false;
                                    for (
                                      let i = cleanValue.length - 1;
                                      i >= 0;
                                      i--
                                    ) {
                                      let digit = parseInt(
                                        cleanValue.charAt(i),
                                        10
                                      );
                                      if (shouldDouble) {
                                        digit *= 2;
                                        if (digit > 9) digit -= 9;
                                      }
                                      sum += digit;
                                      shouldDouble = !shouldDouble;
                                    }
                                    return (
                                      sum % 10 === 0 || "Invalid card number"
                                    );
                                  },
                                },
                              })}
                              onChange={(e) => {
                                // Format card number with spaces
                                let value = e.target.value
                                  .replace(/\s/g, "")
                                  .replace(/(.{4})/g, "$1 ")
                                  .trim();
                                if (value.length > 19)
                                  value = value.substring(0, 19);
                                e.target.value = value;
                                register("cardNumber").onChange(e);
                              }}
                            />
                            {errors.cardNumber && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.cardNumber.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="cardName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name on card{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="cardName"
                              placeholder="John Smith"
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${
                                errors.cardName ? "border-red-500" : ""
                              }`}
                              {...register("cardName", {
                                required: "Name on card is required",
                              })}
                            />
                            {errors.cardName && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.cardName.message}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="cardExpiry"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Expiration date (MM/YY){" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id="cardExpiry"
                                placeholder="MM/YY"
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${
                                  errors.cardExpiry ? "border-red-500" : ""
                                }`}
                                {...register("cardExpiry", {
                                  required: "Expiration date is required",
                                  pattern: {
                                    value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                                    message: "Invalid expiration date (MM/YY)",
                                  },
                                })}
                              />
                              {errors.cardExpiry && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.cardExpiry.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label
                                htmlFor="cardCvv"
                                className="block text-sm font-medium text-gray-700"
                              >
                                CVV <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="password"
                                id="cardCvv"
                                placeholder="123"
                                maxLength={4}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-black ${
                                  errors.cardCvv ? "border-red-500" : ""
                                }`}
                                {...register("cardCvv", {
                                  required: "CVV is required",
                                  pattern: {
                                    value: /^[0-9]{3,4}$/,
                                    message: "CVV must be 3 or 4 digits",
                                  },
                                })}
                              />
                              {errors.cardCvv && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.cardCvv.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center">
                        <input
                          id="paypal"
                          type="radio"
                          value="paypal"
                          className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                          {...register("paymentMethod")}
                        />
                        <label
                          htmlFor="paypal"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          PayPal
                        </label>
                      </div>
                      {paymentMethod === "paypal" && (
                        <div className="mt-4 pl-7 text-sm text-gray-500">
                          You'll be redirected to PayPal to complete your
                          purchase securely.
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center">
                        <input
                          id="apple-pay"
                          type="radio"
                          value="apple-pay"
                          className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                          {...register("paymentMethod")}
                        />
                        <label
                          htmlFor="apple-pay"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Apple Pay
                        </label>
                      </div>
                      {paymentMethod === "apple-pay" && (
                        <div className="mt-4 pl-7 text-sm text-gray-500">
                          Complete your purchase quickly with Apple Pay.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center text-sm text-gray-500">
                    <Lock className="h-4 w-4 text-gray-400 mr-2" />
                    <p>
                      Your payment information is encrypted and secure. We use
                      industry-standard SSL encryption and never store your full
                      card details.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <Shield className="h-4 w-4 text-green-500 mr-2" />
                    <p>PCI DSS compliant payment processing</p>
                  </div>
                </div>
              )}

              {/* Order Review */}
              {activeStep === 3 && (
                <div className="glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl p-6 mb-8 rounded-xl border border-white/30">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">
                    Review Your Order
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Contact Information
                      </h3>
                      <p className="text-sm text-gray-700">{watch("email")}</p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Shipping Address
                      </h3>
                      <p className="text-sm text-gray-700">
                        {watch("firstName")} {watch("lastName")}
                        <br />
                        {watch("address")}
                        <br />
                        {watch("apartment") && (
                          <>
                            {watch("apartment")}
                            <br />
                          </>
                        )}
                        {watch("city")}, {watch("state")} {watch("zipCode")}
                        <br />
                        {watch("phone")}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Payment Method
                      </h3>
                      <p className="text-sm text-gray-700">
                        {watch("paymentMethod") === "credit-card" ? (
                          <>
                            Credit Card ending in{" "}
                            {watch("cardNumber")?.slice(-4)}
                            <br />
                            {watch("cardName")}
                            <br />
                            Expires {watch("cardExpiry")}
                          </>
                        ) : watch("paymentMethod") === "paypal" ? (
                          "PayPal"
                        ) : (
                          "Apple Pay"
                        )}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {items.map((item: CartItem) => (
                          <div key={item.id} className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.image || "/images/logo.png"}
                                alt={item.name}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "/images/logo.png";
                                }}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <div>
                                <h4 className="text-sm text-gray-900 font-medium">
                                  {item.name}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  Qty {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="ml-4 text-sm font-medium text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {activeStep === 1 ? "Back to Cart" : "Back"}
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 via-green-400 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Processing..."
                    : activeStep < 3
                      ? "Continue to Payment"
                      : "Place Order"}
                </Button>
              </div>
            </div>

            {/* Right column - Order Summary */}
            <div className="lg:col-span-5">
              <div className="glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl p-6 rounded-xl border border-white/30">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item: CartItem) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.image || "/images/logo.png"}
                              alt={item.name}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "/images/logo.png";
                              }}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    {(() => {
                      const subtotal = items.reduce(
                        (s: number, it: CartItem) => s + it.price * it.quantity,
                        0
                      );
                      const shipping =
                        subtotal > 50 || subtotal === 0 ? 0 : 5.99;
                      const tax = subtotal * 0.1;
                      const total = subtotal + shipping + tax;
                      return (
                        <div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(subtotal)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span className="font-medium text-gray-900">
                              {shipping === 0
                                ? "Free"
                                : formatCurrency(shipping)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Tax</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(tax)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-base font-medium text-gray-900 mt-3">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="mt-6 flex items-center justify-center text-center text-sm text-gray-500">
                    <p>
                      or{" "}
                      <Link
                        to="/cart"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        return to cart
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              {/* Security Badges */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <Shield className="h-6 w-6 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        Secure Checkout
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-6 w-6 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        Fast Delivery
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Your personal data will be used to process your order,
                    support your experience throughout this website, and for
                    other purposes described in our privacy policy.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
