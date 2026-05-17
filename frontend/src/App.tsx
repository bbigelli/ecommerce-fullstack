import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout/Layout';
import HomePage from './components/Home/HomePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import ProductDetails from './components/Products/ProductDetails';
import PrivateRoute from './components/Auth/PrivateRoute';
import Cart from './components/Cart/Cart';
import './App.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Layout onCartClick={() => setIsCartOpen(true)}>
              <Toaster position="top-right" />
              <Routes>
                {/* Home Page - ROTA PRINCIPAL */}
                <Route path="/" element={<HomePage />} />
                
                {/* Rotas de Produtos */}
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                
                {/* Rotas de Admin */}
                <Route
                  path="/products/new"
                  element={
                    <PrivateRoute requireAdmin>
                      <ProductForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/products/edit/:id"
                  element={
                    <PrivateRoute requireAdmin>
                      <ProductForm />
                    </PrivateRoute>
                  }
                />
                
                {/* Rotas de Autenticação */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Layout>
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;