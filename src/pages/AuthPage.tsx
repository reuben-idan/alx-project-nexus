
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';

interface AuthPageProps {
  tab?: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({ tab: propTab }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>(propTab || 'login');

  useEffect(() => {
    if (location.pathname.endsWith('/register')) {
      setTab('register');
    } else if (location.pathname.endsWith('/login')) {
      setTab('login');
    } else {
      setTab(propTab || 'login');
    }
  }, [location.pathname, propTab]);

  const handleTabChange = (nextTab: 'login' | 'register') => {
    setTab(nextTab);
    navigate(`/auth/${nextTab}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-glass-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 rounded-l-xl font-bold ${tab === 'login' ? 'bg-glass-300 text-glass-700' : 'bg-glass-100 text-glass-500'}`}
            onClick={() => handleTabChange('login')}
          >
            Sign In
          </button>
          <button
            className={`px-6 py-2 rounded-r-xl font-bold ${tab === 'register' ? 'bg-glass-300 text-glass-700' : 'bg-glass-100 text-glass-500'}`}
            onClick={() => handleTabChange('register')}
          >
            Register
          </button>
        </div>
  {tab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage;
