import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CartItem, Product, CartContextType } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems(current => {
      const existing = current.find(item => item.id === product.id);
      if (existing) {
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity,
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems(current => current.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(current =>
      current.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const getTotalItems = useCallback(() =>
    items.reduce((total, item) => total + item.quantity, 0), [items]);

  const getTotalPrice = useCallback(() =>
    items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);

  const getWhatsAppMessage = useCallback(() => {
    const header = `🛍️ *PEDIDO DE ENCOMENDA* 🛍️\n\n`;
    const itemsList = items
      .map(item => `• ${item.name} - ${item.quantity}x (R$ ${(item.price * item.quantity).toFixed(2)})`)
      .join('\n');
    const total = `\n\n💰 *TOTAL: R$ ${getTotalPrice().toFixed(2)}*`;
    const footer = `\n\n📦 Gostaria de saber condições de entrega e prazo para produção.`;
    return `${header}${itemsList}${total}${footer}`;
  }, [items, getTotalPrice]);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity,
      clearCart, getTotalItems, getTotalPrice, getWhatsAppMessage
    }}>
      {children}
    </CartContext.Provider>
  );
};