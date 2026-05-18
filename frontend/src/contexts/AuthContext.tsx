import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User, LoginCredentials, RegisterData, ApiError } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      console.log('🔍 Carregando usuário, token existe?', !!token);
      
      if (token && authService.isAuthenticated()) {
        try {
          console.log('📡 Buscando dados do usuário...');
          const userData = await authService.getCurrentUser();
          console.log('✅ Usuário carregado:', userData);
          setUser(userData);
        } catch (error) {
          console.error('❌ Falha ao carregar usuário:', error);
          authService.logout();
          setUser(null);
        }
      } else {
        console.log('ℹ️ Usuário não autenticado');
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    console.log('🔐 Tentando login com:', credentials.username);
    try {
      const response = await authService.login(credentials);
      console.log('✅ Login bem-sucedido, token recebido');
      
      const userData = await authService.getCurrentUser();
      console.log('✅ Dados do usuário carregados:', userData);
      setUser(userData);
      toast.success('Login realizado com sucesso!');
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: ApiError } };
      const message = apiError.response?.data?.detail || 'Erro ao fazer login';
      console.error('❌ Erro no login:', message);
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    console.log('📝 Tentando registrar:', userData.username);
    try {
      await authService.register(userData);
      console.log('✅ Registro bem-sucedido');
      toast.success('Cadastro realizado com sucesso! Faça login.');
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: ApiError } };
      const message = apiError.response?.data?.detail || 'Erro ao cadastrar';
      console.error('❌ Erro no registro:', message);
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout...');
    authService.logout();
    setUser(null);
    toast.success('Logout realizado com sucesso!');
  };

  const isAdmin = user?.is_admin || false;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};