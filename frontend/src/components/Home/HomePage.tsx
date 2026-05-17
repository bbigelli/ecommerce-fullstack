import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import ProductCard from '../Products/ProductCard';

const HomePage: React.FC = () => {
  const { products, loading, fetchProducts } = useProducts();
  const featuredProducts = products.slice(0, 6);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-gradient-to-r from-green-700 to-green-500">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Artelli Artesanatos</h1>
          <p className="text-xl mb-8">Peças únicas feitas à mão com amor</p>
          <Link 
            to="/products"
            className="inline-block bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-400"
          >
            Ver Produtos
          </Link>
        </div>
      </section>

      {/* Sobre Nós */}
      <section className="py-16 bg-white" id="sobre">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Sobre Nós</h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mb-8"></div>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 text-lg mb-4">
              A Artelli Artesanatos nasceu do sonho de valorizar o trabalho manual 
              e a criatividade brasileira.
            </p>
            <p className="text-gray-600 text-lg">
              Cada peça é única e produzida com muito carinho especialmente para você!
            </p>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-16 bg-gray-50" id="produtos">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Nossos Produtos</h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mb-8"></div>
          
          {loading ? (
            <div className="text-center">Carregando...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/products" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Ver todos os produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="py-16 bg-white" id="contato">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Contato</h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mb-8"></div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Fale Conosco</h3>
              <p className="text-gray-600 mb-4">📱 (11) 9221-6409</p>
              <a 
                href="https://wa.me/551192216409"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;