import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import ProductDetails from './components/Products/ProductDetails';
import PrivateRoute from './components/Auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <Layout>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Navigate to="/products" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetails />} />
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
            </Routes>
          </Layout>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;