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
    toast.success(`"${product.name}" adicionado ao carrinho!`);
  }, [addToCart, product]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm(`Deletar "${product.name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteProduct(product.id);
      // Se estiver na página de detalhes, voltar para lista
      navigate('/products');
    } catch {
      // Erro já tratado no context com toast
    }
  }, [deleteProduct, navigate, product.id, product.name]);

  return (
    <article className="card flex flex-col h-full" aria-label={`Produto: ${product.name}`}>
      {/* Imagem */}
      <div className="w-full h-44 sm:h-48 bg-gray-100 flex-shrink-0">
        <OptimizedImage
          src={product.image_url ?? ''}
          alt={product.name}
          className="w-full h-full"
          objectFit="cover"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <p className="price">
          <span className="sr-only">Preço:</span>
          R$ {product.price.toFixed(2)}
        </p>

        {/* Banner encomenda */}
        <div className="order-banner" aria-label="Produto sob encomenda">
          <p className="text-xs font-semibold text-yellow-800">✨ Produto sob encomenda</p>
          <p className="text-xs text-yellow-700">Não possuímos estoque fixo</p>
        </div>

        {/* Ações */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="btn-primary flex-1 text-sm"
              aria-label={`Ver detalhes de ${product.name}`}
            >
              Ver Detalhes
            </Link>
            <button
              onClick={handleAddToCart}
              className="btn-success flex-1 text-sm"
              type="button"
              aria-label={`Adicionar ${product.name} ao carrinho`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-6" />
              </svg>
              Carrinho
            </button>
          </div>

          {/* Ações admin */}
          {isAdmin && (
            <div className="flex gap-2" role="group" aria-label="Ações de administrador">
              <Link
                to={`/products/edit/${product.id}`}
                className="btn-warning flex-1 text-sm"
                aria-label={`Editar ${product.name}`}
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="btn-danger flex-1 text-sm"
                type="button"
                aria-label={`Deletar ${product.name}`}
              >
                Deletar
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default React.memo(ProductCard);