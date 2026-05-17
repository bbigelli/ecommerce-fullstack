import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CartIcon from '../Cart/CartIcon';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="relative overflow-hidden">
      <Link to="/#sobre" className="text-white hover:text-yellow-200 transition font-medium">
        Sobre
      </Link>
      <Link to="/#produtos" className="text-white hover:text-yellow-200 transition font-medium">
        Produtos
      </Link>
      <Link to="/#contato" className="text-white hover:text-yellow-200 transition font-medium">
        Contato
      </Link>
      {/* Gradiente de fundo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-yellow-500 to-green-600 bg-size-200 animate-gradient"></div>
       
      {/* Conteúdo do header */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        {/* Logo e Nome - lado esquerdo */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Logo imagem */}
          <img 
            src="/assets/Logo.png" 
            alt="Artelli Logo" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain transition-transform group-hover:scale-105"
          />
          
          {/* Nome da empresa */}
          <div className="text-white">
            <span className="text-2xl md:text-3xl font-bold tracking-tight">
              Artelli
            </span>
            <span className="block text-sm md:text-base opacity-90 -mt-1">
              Artesanatos
            </span>
          </div>
        </Link>
        
        {/* Menu e ícones - lado direito */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link 
            to="/products" 
            className="text-white hover:text-yellow-200 transition font-medium text-sm md:text-base"
          >
            Produtos
          </Link>
          
          <CartIcon onClick={onCartClick} />
          
          {user ? (
            <div className="flex items-center gap-3 md:gap-4">
              <span className="text-sm text-white hidden sm:inline">
                Olá, {user.username}
                {isAdmin && <span className="ml-1 text-xs text-yellow-200 font-semibold">(Admin)</span>}
              </span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-yellow-200 transition font-medium text-sm md:text-base">
                Sair
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="text-white hover:text-yellow-200 transition font-medium text-sm md:text-base">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;