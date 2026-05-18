// src/components/Layout/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleScrollToSection = (sectionId: string) => {
    // Se não estiver na página inicial, navegue para ela primeiro
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // Se já está na página inicial, role até a seção
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-amber-900 via-orange-700 to-amber-600 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img 
              src="/assets/Logo.png" 
              alt="Artelli Artesanatos Logo" 
              className="h-10 w-auto group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/40?text=Artelli';
              }}
            />
            <span className="text-xl font-bold text-white hidden sm:inline">
              Artelli Artesanatos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-yellow-200 font-medium transition-colors">
              Início
            </Link>
            <Link to="/products" className="text-white hover:text-yellow-200 font-medium transition-colors">
              Produtos
            </Link>
            <button 
              onClick={() => handleScrollToSection('sobre')}
              className="text-white hover:text-yellow-200 font-medium transition-colors"
            >
              Sobre
            </button>
            <button 
              onClick={() => handleScrollToSection('contato')}
              className="text-white hover:text-yellow-200 font-medium transition-colors"
            >
              Contato
            </button>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm hidden sm:inline">
                  Olá, {user.username}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-white text-amber-800 px-4 py-2 rounded-lg font-medium hover:bg-amber-100 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Carrinho Button */}
            <Link
              to="/cart"
              className="relative bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
              aria-label="Carrinho de compras"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-6" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-amber-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white border-opacity-20">
            <Link 
              to="/" 
              className="block text-white hover:text-yellow-200 py-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/products" 
              className="block text-white hover:text-yellow-200 py-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Produtos
            </Link>
            <button 
              onClick={() => handleScrollToSection('sobre')}
              className="block w-full text-left text-white hover:text-yellow-200 py-2"
            >
              Sobre
            </button>
            <button 
              onClick={() => handleScrollToSection('contato')}
              className="block w-full text-left text-white hover:text-yellow-200 py-2"
            >
              Contato
            </button>
            <Link 
              to="/cart" 
              className="block text-white hover:text-yellow-200 py-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Carrinho {cartItemsCount > 0 && `(${cartItemsCount})`}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;