import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { productService } from '../services/productService';
import { Product, ApiError } from '../types';
import toast from 'react-hot-toast';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'owner_id'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const data = (error.response as { data?: ApiError }).data;
    return data?.detail ?? fallback;
  }
  return fallback;
}

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (loading) return; // Previne chamadas simultâneas
    
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error: unknown) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (
    productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'owner_id'>
  ) => {
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      toast.success('Produto criado com sucesso!');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Erro ao criar produto'));
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id: number, productData: Partial<Product>) => {
    try {
      const updated = await productService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      toast.success('Produto atualizado com sucesso!');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Erro ao atualizar produto'));
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Produto deletado com sucesso!');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Erro ao deletar produto'));
      throw error;
    }
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};