import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';
import { storage } from '../utils/storage';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data.access_token) {
      storage.setToken(response.data.access_token);
    }
    
    return response.data;
  },
  
  async register(userData: RegisterData): Promise<User> {
    const response = await api.post('/register', userData);
    return response.data;
  },
  
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me');
    const user = response.data;
    storage.setUser(user);
    return user;
  },
  
  logout(): void {
    storage.clearAll();
  },
  
  isAuthenticated(): boolean {
    return !!storage.getToken();
  }
};