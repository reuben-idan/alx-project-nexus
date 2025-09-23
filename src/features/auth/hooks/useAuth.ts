import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, selectAuthToken, clearCredentials } from '../../../store/slices/authSlice';

export function useAuth() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAuthToken);
  const dispatch = useDispatch();

  const logout = () => dispatch(clearCredentials());

  return { user, isAuthenticated, token, logout };
}
