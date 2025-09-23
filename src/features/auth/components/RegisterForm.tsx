import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthLoading, setCredentials, setAuthError, selectAuthError, selectAuthLoading } from '../../../store/slices/authSlice';
import { RegisterData } from '../../../types/auth';

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);
  const [form, setForm] = useState<RegisterData>({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', acceptTerms: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      dispatch(setAuthError('Passwords do not match'));
      return;
    }
    if (!form.acceptTerms) {
      dispatch(setAuthError('You must accept the terms'));
      return;
    }
    dispatch(setAuthLoading(true));
    try {
      // TODO: Replace with real API call
  const fakeUser = { id: '2', email: form.email, firstName: form.firstName, lastName: form.lastName, fullName: `${form.firstName} ${form.lastName}`, role: 'user' as const, isEmailVerified: false, createdAt: '', updatedAt: '' };
      dispatch(setCredentials({ user: fakeUser, token: 'fake-token' }));
      dispatch(setAuthError(null));
    } catch (err) {
      dispatch(setAuthError('Registration failed'));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex gap-2">
  <input name="firstName" type="text" required placeholder="First Name" className="input-glass w-1/2 text-black" value={form.firstName} onChange={handleChange} />
  <input name="lastName" type="text" required placeholder="Last Name" className="input-glass w-1/2 text-black" value={form.lastName} onChange={handleChange} />
      </div>
      <div>
  <input name="email" type="email" required placeholder="Email" className="input-glass w-full text-black" value={form.email} onChange={handleChange} />
      </div>
      <div className="flex gap-2">
        <div className="relative w-1/2">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Password"
            className="input-glass w-full pr-10 text-black"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-glass-600 hover:text-glass-900 text-sm"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="relative w-1/2">
          <input
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            required
            placeholder="Confirm Password"
            className="input-glass w-full pr-10 text-black"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-glass-600 hover:text-glass-900 text-sm"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="acceptTerms" checked={form.acceptTerms} onChange={e => setForm({ ...form, acceptTerms: e.target.checked })} className="mr-2" />
        <span>I accept the terms and conditions</span>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button type="submit" className="btn-water w-full" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
    </form>
  );
};

export default RegisterForm;
