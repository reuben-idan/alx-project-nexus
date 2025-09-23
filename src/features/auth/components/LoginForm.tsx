import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthLoading, setCredentials, setAuthError, selectAuthError, selectAuthLoading } from '../../../store/slices/authSlice';
import { LoginCredentials } from '../../../types/auth';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);
  const [form, setForm] = useState<LoginCredentials>({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setAuthLoading(true));
    try {
      // TODO: Replace with real API call
  const fakeUser = { id: '1', email: form.email, firstName: 'John', lastName: 'Doe', fullName: 'John Doe', role: 'user' as const, isEmailVerified: true, createdAt: '', updatedAt: '' };
      dispatch(setCredentials({ user: fakeUser, token: 'fake-token' }));
      dispatch(setAuthError(null));
    } catch (err) {
      dispatch(setAuthError('Invalid credentials'));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
  <input id="email" name="email" type="email" autoComplete="email" required className="input-glass w-full text-black" value={form.email} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
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
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={e => setForm({ ...form, rememberMe: e.target.checked })} className="mr-2" />
          Remember me
        </label>
        <button type="button" className="text-sm text-glass-600 hover:underline">Forgot password?</button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button type="submit" className="btn-water w-full" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</button>
    </form>
  );
};

export default LoginForm;
