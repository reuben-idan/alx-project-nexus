import { LoginCredentials, RegisterData } from '../../../types/auth';

export const authApi = {
  async login(data: LoginCredentials) {
    return Promise.resolve({ user: { id: '1', email: data.email, firstName: 'John', lastName: 'Doe', fullName: 'John Doe', role: 'user', isEmailVerified: true, createdAt: '', updatedAt: '' }, token: 'fake-token' });
  },
  async register(data: RegisterData) {
    return Promise.resolve({ user: { id: '2', email: data.email, firstName: data.firstName, lastName: data.lastName, fullName: `${data.firstName} ${data.lastName}`, role: 'user', isEmailVerified: false, createdAt: '', updatedAt: '' }, token: 'fake-token' });
  },
  async logout() {
    return Promise.resolve(true);
  },
};
