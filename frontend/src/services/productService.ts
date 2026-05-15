import api from './api';
import { Product } from '../types';

export const productService = {
  async getProducts(params?: { skip?: number; limit?: number; category?: string }): Promise<Product[]> {
    const response = await api.get('/products/', { params });
    return response.data;
  },
  
  async getProduct(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'owner_id'>): Promise<Product> {
    const response = await api.post('/products/', product);
    return response.data;
  },
  
  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },
  
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  }
};