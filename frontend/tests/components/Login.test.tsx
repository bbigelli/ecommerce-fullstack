import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from '../../src/components/Auth/Login';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { act } from 'react-dom/test-utils';

// Mock do react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do authService
jest.mock('../../src/services/authService', () => ({
  authService: {
    login: jest.fn(),
    getCurrentUser: jest.fn(),
    isAuthenticated: jest.fn(),
    logout: jest.fn(),
  },
}));

import { authService } from '../../src/services/authService';
import toast from 'react-hot-toast';

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  describe('Renderização', () => {
    test('deve renderizar o formulário de login corretamente', () => {
      renderLogin();

      // Verificar se os elementos principais estão presentes
      expect(screen.getByText(/faça login na sua conta/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/nome de usuário/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
      expect(screen.getByText(/crie uma nova conta/i)).toBeInTheDocument();
    });

    test('deve ter o link para página de registro', () => {
      renderLogin();
      const registerLink = screen.getByText(/crie uma nova conta/i);
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });

    test('deve ter campos de input com os tipos corretos', () => {
      renderLogin();
      
      const usernameInput = screen.getByPlaceholderText(/nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/senha/i);
      
      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Interação do Usuário', () => {
    test('deve atualizar os campos de input quando o usuário digita', async () => {
      renderLogin();
      
      const usernameInput = screen.getByPlaceholderText(/nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/senha/i);
      
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      
      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('password123');
    });

    test('deve chamar a função de login ao submeter o formulário', async () => {
      const mockLogin = jest.fn().mockResolvedValue({});
      (authService.login as jest.Mock).mockImplementation(mockLogin);
      (authService.getCurrentUser as jest.Mock).mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@test.com',
        is_admin: false,
      });

      renderLogin();
      
      const usernameInput = screen.getByPlaceholderText(/nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123',
        });
      });
    });

    test('deve desabilitar o botão durante o envio', async () => {
      (authService.login as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      renderLogin();
      
      const usernameInput = screen.getByPlaceholderText(/nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      
      fireEvent.click(submitButton);
      
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/entrando/i);
    });
  });

  describe('Validação', () => {
    test('deve mostrar erro quando campos estão vazios', async () => {
      renderLogin();
      
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      fireEvent.click(submitButton);
      
      // O formulário HTML5 vai mostrar validação nativa
      const usernameInput = screen.getByPlaceholderText(/nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/senha/i);
      
      expect(usernameInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    test('deve mostrar mensagem de erro quando credenciais são inválidas', async () => {
      const errorMessage = 'Credenciais inválidas';
      (authService.login as jest.Mock).mockRejectedValue({
        response: { data: { detail: errorMessage } }
      });

      renderLogin();
      
      const usernameInput = screen.getByPlaceholderText(/nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      
      await userEvent.type(usernameInput, 'wronguser');
      await userEvent.type(passwordInput, 'wrongpass');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    test('deve mostrar mensagem de erro genérica quando API falha', async () => {
      (authService.login as jest.Mock).mockRejectedValue(new Error('Network error'));

      renderLogin();
      
      const usernameInput = screen.getByPlaceholderText(/nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'testpass');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Erro ao fazer login');
      });
    });
  });

  describe('Navegação', () => {
    test('deve redirecionar para /products após login bem-sucedido', async () => {
      (authService.login as jest.Mock).mockResolvedValue({ access_token: 'fake-token' });
      (authService.getCurrentUser as jest.Mock).mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@test.com',
        is_admin: false,
      });

      renderLogin();
      
      const usernameInput = screen.getByPlaceholderText(/nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/products');
      });
    });
  });

  describe('Acessibilidade', () => {
    test('deve ter labels acessíveis', () => {
      renderLogin();
      
      expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    });

    test('deve permitir submit com tecla Enter', async () => {
      (authService.login as jest.Mock).mockResolvedValue({ access_token: 'fake-token' });
      (authService.getCurrentUser as jest.Mock).mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@test.com',
        is_admin: false,
      });

      renderLogin();
      
      const usernameInput = screen.getByPlaceholderText(/nome de usuário/i);
      const passwordInput = screen.getByPlaceholderText(/senha/i);
      
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      
      fireEvent.submit(passwordInput.closest('form')!);
      
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
    });
  });
});