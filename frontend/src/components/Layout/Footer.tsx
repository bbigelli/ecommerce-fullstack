// src/components/Layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-amber-900 to-orange-800 text-white mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Artelli Artesanatos</h3>
            <p className="text-white/80">
              Transformando criatividade em arte, com amor e dedicação.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/80 hover:text-yellow-200">Início</Link></li>              
              <li><Link to="/" className="text-white/80 hover:text-yellow-200">Contato</Link></li>
              <li><Link to="/" className="text-white/80 hover:text-yellow-200">Sobre</Link></li>
              <li><Link to="/products" className="text-white/80 hover:text-yellow-200">Produtos</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <p className="text-white/80">WhatsApp: (11) 99221-6409</p>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80">
          <p>&copy; 2026 Artelli Artesanatos. Todos os direitos reservados.</p>
          <p> Desenvolvido por Bruno Bigelli</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;