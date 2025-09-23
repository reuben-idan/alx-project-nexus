import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, User, Mail, Phone, MapPin, CreditCard, Bell, Shield, LogOut, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  notifications: {
    email: boolean;
    sms: boolean;
    promotions: boolean;
  };
};

const ProfilePage = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const defaultValues: FormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      sms: false,
      promotions: true
    }
  };
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ defaultValues });
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (data: FormData) => {
    console.log('Profile updated:', data);
    setIsEditing(false);
    // In a real app, you would update the user's profile here
  };
  
  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            My Account
          </h1>
          
          <Tabs 
            defaultValue="profile" 
            className="mt-8"
          >
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Sidebar Navigation */}
              <div className="w-full sm:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                  <div className="p-6 text-center border-b border-gray-200">
                    <div className="relative mx-auto h-24 w-24 rounded-full bg-gray-100 overflow-hidden">
                      {avatar ? (
                        <img 
                          src={avatar} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-50"
                      >
                        <Camera className="h-4 w-4 text-gray-600" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      John Doe
                    </h3>
                    <p className="text-sm text-gray-500">Member since June 2023</p>
                  </div>
                  
                  <TabsList className="flex flex-col items-start p-0 rounded-none">
                    <TabsTrigger 
                      value="profile" 
                      className="w-full justify-start px-6 py-4 text-left border-b border-gray-200 rounded-none data-[state=active]:bg-gray-50 data-[state=active]:text-green-600 data-[state=active]:shadow-none"
                    >
                      <User className="mr-3 h-5 w-5" />
                      <span>Profile Information</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="addresses" 
                      className="w-full justify-start px-6 py-4 text-left border-b border-gray-200 rounded-none data-[state=active]:bg-gray-50 data-[state=active]:text-green-600 data-[state=active]:shadow-none"
                    >
                      <MapPin className="mr-3 h-5 w-5" />
                      <span>Addresses</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="orders" 
                      className="w-full justify-start px-6 py-4 text-left border-b border-gray-200 rounded-none data-[state=active]:bg-gray-50 data-[state=active]:text-green-600 data-[state=active]:shadow-none"
                    >
                      <CreditCard className="mr-3 h-5 w-5" />
                      <span>My Orders</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="w-full justify-start px-6 py-4 text-left border-b border-gray-200 rounded-none data-[state=active]:bg-gray-50 data-[state=active]:text-green-600 data-[state=active]:shadow-none"
                    >
                      <Bell className="mr-3 h-5 w-5" />
                      <span>Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="w-full justify-start px-6 py-4 text-left border-b border-gray-200 rounded-none data-[state=active]:bg-gray-50 data-[state=active]:text-green-600 data-[state=active]:shadow-none"
                    >
                      <Shield className="mr-3 h-5 w-5" />
                      <span>Security</span>
                    </TabsTrigger>
                    <button
                      type="button"
                      className="flex w-full items-center px-6 py-4 text-left text-red-600 hover:bg-red-50"
                      onClick={() => console.log('Sign out')}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </TabsList>
                </div>
                
                <div className="mt-6 bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800">Premium Member</h4>
                  <p className="mt-1 text-sm text-green-700">
                    Enjoy free shipping on all orders and exclusive discounts.
                  </p>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1">
                <TabsContent value="profile" className="mt-0">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Profile Information
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Update your personal information and how we can reach you.
                          </p>
                        </div>
                        {!isEditing ? (
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                          >
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="space-x-2">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              form="profile-form"
                            >
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="divide-y divide-gray-200">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                              First name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="firstName"
                                disabled={!isEditing}
                                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                                  errors.firstName 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                } ${!isEditing ? 'bg-gray-50' : ''}`}
                                {...register('firstName', { required: 'First name is required' })}
                              />
                              {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                              Last name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="lastName"
                                disabled={!isEditing}
                                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                                  errors.lastName 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                } ${!isEditing ? 'bg-gray-50' : ''}`}
                                {...register('lastName', { required: 'Last name is required' })}
                              />
                              {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email address
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                <Mail className="h-4 w-4" />
                              </span>
                              <input
                                type="email"
                                id="email"
                                disabled={!isEditing}
                                className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md sm:text-sm ${
                                  errors.email 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                } ${!isEditing ? 'bg-gray-50' : ''}`}
                                {...register('email', { 
                                  required: 'Email is required',
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                  }
                                })}
                              />
                            </div>
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                          </div>
                          
                          <div className="sm:col-span-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                              Phone number
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                <Phone className="h-4 w-4" />
                              </span>
                              <input
                                type="tel"
                                id="phone"
                                disabled={!isEditing}
                                className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md sm:text-sm ${
                                  errors.phone 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                } ${!isEditing ? 'bg-gray-50' : ''}`}
                                {...register('phone', { 
                                  required: 'Phone number is required',
                                  pattern: {
                                    value: /^[0-9\-\+\(\)\s]+$/,
                                    message: 'Invalid phone number'
                                  }
                                })}
                              />
                            </div>
                            {errors.phone && (
                              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </TabsContent>
                
                <TabsContent value="addresses" className="mt-0">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Saved Addresses
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Manage your shipping addresses for faster checkout.
                      </p>
                    </div>
                    
                    <div className="px-4 py-5 sm:p-6">
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900">Home</h4>
                            <div className="flex space-x-2">
                              <button 
                                type="button" 
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button 
                                type="button" 
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            123 Main St<br />
                            Anytown, CA 12345<br />
                            United States
                          </p>
                          <p className="mt-2 text-sm text-gray-600">
                            Phone: (555) 123-4567
                          </p>
                          <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900">Work</h4>
                            <div className="flex space-x-2">
                              <button 
                                type="button" 
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button 
                                type="button" 
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            456 Business Ave, Suite 100<br />
                            Anytown, CA 12345<br />
                            United States
                          </p>
                          <p className="mt-2 text-sm text-gray-600">
                            Phone: (555) 987-6543
                          </p>
                          <button 
                            type="button" 
                            className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                          >
                            Set as default
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button>
                          + Add New Address
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="orders" className="mt-0">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Order History
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        View and track your recent orders.
                      </p>
                    </div>
                    
                    <div className="px-4 py-5 sm:p-6">
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No recent orders</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          You haven't placed any orders yet. Start shopping to see your orders here.
                        </p>
                        <div className="mt-6">
                          <Button asChild>
                            <a href="/products">Continue Shopping</a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Notification Preferences
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Manage how we contact you.
                      </p>
                    </div>
                    
                    <div className="px-4 py-5 sm:p-6">
                      <form className="space-y-6">
                        <fieldset>
                          <legend className="text-base font-medium text-gray-900">Email Notifications</legend>
                          <div className="mt-4 space-y-4">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="order-updates"
                                  name="order-updates"
                                  type="checkbox"
                                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                                  defaultChecked
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="order-updates" className="font-medium text-gray-700">Order updates</label>
                                <p className="text-gray-500">Get updates about your orders and returns.</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="promotions"
                                  name="promotions"
                                  type="checkbox"
                                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                                  defaultChecked
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="promotions" className="font-medium text-gray-700">Promotions</label>
                                <p className="text-gray-500">Get the latest deals and offers.</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="newsletter"
                                  name="newsletter"
                                  type="checkbox"
                                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="newsletter" className="font-medium text-gray-700">Newsletter</label>
                                <p className="text-gray-500">Get our weekly newsletter with tips and inspiration.</p>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                        
                        <fieldset>
                          <legend className="text-base font-medium text-gray-900">SMS Notifications</legend>
                          <div className="mt-4 space-y-4">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="sms-order-updates"
                                  name="sms-order-updates"
                                  type="checkbox"
                                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="sms-order-updates" className="font-medium text-gray-700">Order updates</label>
                                <p className="text-gray-500">Get text messages about your orders.</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="sms-promotions"
                                  name="sms-promotions"
                                  type="checkbox"
                                  className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="sms-promotions" className="font-medium text-gray-700">Promotions</label>
                                <p className="text-gray-500">Get exclusive deals via text message.</p>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                        
                        <div className="pt-5">
                          <div className="flex justify-end">
                            <Button type="button" variant="outline" className="mr-3">
                              Cancel
                            </Button>
                            <Button type="submit">
                              Save Preferences
                            </Button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Security Settings
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Manage your account security settings.
                      </p>
                    </div>
                    
                    <div className="px-4 py-5 sm:p-6">
                      <form className="space-y-6">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Change Password</h4>
                          <p className="text-sm text-gray-500">
                            Update your password to keep your account secure.
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                              Current Password
                            </label>
                            <div className="mt-1">
                              <input
                                id="current-password"
                                name="current-password"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                              New Password
                            </label>
                            <div className="mt-1">
                              <input
                                id="new-password"
                                name="new-password"
                                type="password"
                                autoComplete="new-password"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                              Confirm New Password
                            </label>
                            <div className="mt-1">
                              <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-5">
                          <div className="flex justify-end">
                            <Button type="submit">
                              Update Password
                            </Button>
                          </div>
                        </div>
                      </form>
                      
                      <div className="mt-10 border-t border-gray-200 pt-6">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account.
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          <Button variant="outline">
                            Set Up Two-Factor Authentication
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-10 border-t border-gray-200 pt-6">
                        <div>
                          <h4 className="text-base font-medium text-gray-900">Account Deletion</h4>
                          <p className="text-sm text-gray-500">
                            Permanently delete your account and all associated data.
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          <Button variant="destructive">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
