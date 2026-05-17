import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre Nós</h3>
            <p className="text-gray-300">
              Artelli Artesanatos é uma loja online especializada em produtos artesanais personalizados. Cada peça é feita sob encomenda, garantindo exclusividade e qualidade para nossos clientes.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li><a href="/products" className="text-gray-300 hover:text-white transition">Produtos</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition">Sobre</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition">Contato</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <p className="text-gray-300">WhatsApp: (11) 99221-6409</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2026 Artelli Artesanatos. Todos os direitos reservados.</p>
          <p>&copy; 2026 Desenvolvido por Bruno Bigelli</p>
        </div>
        
                  
         
      </div>
    </footer>
  );
};

export default Footer;