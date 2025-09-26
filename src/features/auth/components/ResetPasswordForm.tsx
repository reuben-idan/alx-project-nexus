import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthLoading,
  setAuthError,
  selectAuthError,
  selectAuthLoading,
} from "../../../store/slices/authSlice";
import { ResetPasswordData } from "../../../types/auth";

const ResetPasswordForm: React.FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);
  const [form, setForm] = useState<ResetPasswordData>({ email: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setAuthLoading(true));
    try {
      // TODO: Replace with real API call
      setSuccess(true);
      dispatch(setAuthError(null));
    } catch (err) {
      dispatch(setAuthError("Failed to send reset email"));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="input-glass w-full text-black"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && (
        <div className="text-green-600 text-sm">
          Reset link sent! Check your email.
        </div>
      )}
      <button type="submit" className="btn-water w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
