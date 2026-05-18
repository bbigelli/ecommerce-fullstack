export interface User {
  id: number;
  email: string;
  username: string;
  address?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  owner_id: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

/** Formato de erro retornado pela API (FastAPI detail) */
export interface ApiError {
  detail: string;
  status?: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  message?: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getWhatsAppMessage: () => string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  is_available: boolean;
}

/** Tipo genérico para funções assíncronas */
export type AsyncFn<T = void, A extends unknown[] = []> = (...args: A) => Promise<T>;