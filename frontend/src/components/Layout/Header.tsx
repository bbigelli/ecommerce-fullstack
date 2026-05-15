import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          E‑Commerce
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">
            Produtos
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Olá, {user.username}
                {isAdmin && <span className="ml-1 text-xs text-blue-600 font-semibold">(Admin)</span>}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition font-medium"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;