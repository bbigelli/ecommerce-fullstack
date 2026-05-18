// src/components/Home/HomePage.tsx
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HomePage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Verifica se veio com estado para rolar até alguma seção
    if (location.state && (location.state as any).scrollTo) {
      const sectionId = (location.state as any).scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Pequeno delay para garantir que a página carregou
    }
  }, [location]);

  return (
    <div className="bg-gradient-to-b from-artesanal-warm to-white">
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-up">
            <h1 className="text-5xl lg:text-7xl font-bold text-artesanal-brown mb-6">
              Arte que Transforma
              <span className="block text-artesanal-orange">Feito com Amor</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Peças únicas e personalizadas feitas à mão com materiais de qualidade.
              Cada produto conta uma história especial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-primary px-8 py-3 text-lg">
                Explorar Produtos
              </Link>
              {!user && (
                <Link to="/register" className="btn-secondary px-8 py-3 text-lg">
                  Cadastre-se
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-20 bg-gradient-to-r from-artesanal-cream to-artesanal-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-artesanal-brown mb-4">
              Nossa História
            </h2>
            <div className="divider-artesanal w-24 mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                A Artelli Artesanatos nasceu do sonho de valorizar o trabalho manual e 
                a criatividade brasileira. Cada peça é cuidadosamente produzida por 
                artesãos talentosos que transformam matéria-prima em arte.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nossa missão é conectar pessoas a peças únicas, carregadas de 
                significado e história. Trabalhamos exclusivamente sob encomenda 
                para garantir que cada produto seja especial e personalizado.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-artesanal-orange">100+</div>
                  <div className="text-sm text-gray-600">Clientes Felizes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-artesanal-orange">50+</div>
                  <div className="text-sm text-gray-600">Produtos Únicos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-artesanal-orange">5+</div>
                  <div className="text-sm text-gray-600">Anos de História</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-artesanal-orange/20 rounded-full blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3"
                alt="Artesanato"
                className="rounded-2xl shadow-2xl relative z-10 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-20 bg-gradient-to-r from-artesanal-brown to-artesanal-terracotta">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Entre em Contato
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
            <p className="text-white/90 mt-4 text-lg">
              Tire suas dúvidas ou faça seu pedido personalizado
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Telefone</h3>
                    <p className="text-white/80">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Endereço</h3>
                    <p className="text-white/80">São Paulo - SP</p>
                  </div>
                </div>
              </div>
              <button className="btn-whatsapp w-full mt-8">
                Falar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;