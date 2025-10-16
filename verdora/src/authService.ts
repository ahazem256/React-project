import type { LoginCredentials, RegisterData, User } from './Types/authTypes';
import mockAuthData from '../db.json';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      return mockAuthData.user;
    } else {
      throw new Error('Invalid credentials');
    }
  },

  register: async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockAuthData.register;
  },

  getCurrentUser: async (): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Check if user is logged in (in real app, check token)
    const token = localStorage.getItem('token');
    return token ? mockAuthData.user : null;
  }
};