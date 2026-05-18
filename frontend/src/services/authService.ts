import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';
import { storage } from '../utils/storage';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await api.post('/token', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data.access_token) {
      storage.setToken(response.data.access_token);
      // Armazenar também o tipo do token
      if (response.data.token_type) {
        localStorage.setItem('token_type', response.data.token_type);
      }
    }
    
    return response.data;
  },
  
  async register(userData: RegisterData): Promise<User> {
    const response = await api.post('/register', userData);
    return response.data;
  },
  
  async getCurrentUser(): Promise<User> {
    const token = storage.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await api.get('/users/me');
    const user = response.data;
    storage.setUser(user);
    return user;
  },
  
  logout(): void {
    storage.clearAll();
    localStorage.removeItem('token_type');
  },
  
  isAuthenticated(): boolean {
    const token = storage.getToken();
    return !!token;
  },
  
  getToken(): string | null {
    return storage.getToken();
  }
};