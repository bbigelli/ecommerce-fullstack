import React from 'react';
import { Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAdmin } = useAuth();
  const { deleteProduct } = useProducts();

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja deletar ${product.name}?`)) {
      await deleteProduct(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400">Sem imagem</div>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-blue-600">
            R$ {product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Estoque: {product.stock}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 bg-blue-600 text-white text-center px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Ver detalhes
          </Link>
          
          {isAdmin && (
            <>
              <Link
                to={`/products/edit/${product.id}`}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Deletar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;