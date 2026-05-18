// src/App.tsx
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
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Layout>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
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
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;