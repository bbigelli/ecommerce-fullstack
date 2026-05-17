import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import OptimizedImage from '../Common/OptimizedImage';
import { Product } from '../../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { deleteProduct } = useProducts();
  const navigate = useNavigate();

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  }, [addToCart, product]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm(`Deletar "${product.name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteProduct(product.id);
      // ProductContext já remove da lista e exibe toast
    } catch {
      toast.error('Erro ao deletar produto');
    }
  }, [deleteProduct, product.id, product.name]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="w-full h-48 bg-gray-200">
        <OptimizedImage
          src={product.image_url}
          alt={product.name}
          className="w-full h-full"
          objectFit="cover"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description || 'Sem descrição'}
        </p>

        <div className="mb-3">
          <span className="text-2xl font-bold text-blue-600">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        <div className="mb-3 p-2 bg-yellow-50 rounded-md border border-yellow-200">
          <p className="text-xs text-yellow-800 font-medium">✨ Produto sob encomenda</p>
          <p className="text-xs text-yellow-600 mt-1">Não possuímos estoque fixo</p>
        </div>

        <div className="flex gap-2 mt-auto flex-wrap">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded-md hover:bg-blue-700 transition text-sm"
          >
            Ver Detalhes
          </Link>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition text-sm flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-6" />
            </svg>
            Carrinho
          </button>

          {isAdmin && (
            <div className="flex gap-1 w-full">
              <Link
                to={`/products/edit/${product.id}`}
                className="flex-1 bg-yellow-500 text-white text-center px-3 py-2 rounded-md hover:bg-yellow-600 transition text-sm"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition text-sm"
              >
                Deletar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);