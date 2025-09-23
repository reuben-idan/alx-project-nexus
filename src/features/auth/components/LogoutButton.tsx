import React from 'react';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../../../store/slices/authSlice';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearCredentials());
  };
  return (
    <button className="btn-water w-full" onClick={handleLogout}>
      Sign Out
    </button>
  );
};

export default LogoutButton;
