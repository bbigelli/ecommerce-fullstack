import React, { createContext, useContext, useState, ReactNode } from 'react';
import { productService } from '../services/productService';
import { Product } from '../types';
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

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'owner_id'>) => {
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts([...products, newProduct]);
      toast.success('Produto criado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao criar produto';
      toast.error(message);
      throw error;
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      const updated = await productService.updateProduct(id, productData);
      setProducts(products.map(p => p.id === id ? updated : p));
      toast.success('Produto atualizado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao atualizar produto';
      toast.error(message);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Produto deletado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao deletar produto';
      toast.error(message);
      throw error;
    }
  };

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