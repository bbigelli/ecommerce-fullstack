import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { deleteProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProduct(parseInt(id!));
      setProduct(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja deletar ${product?.name}?`)) {
      await deleteProduct(product!.id);
      navigate('/products');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Produto não encontrado" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-lg">Sem imagem</div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-blue-600">
                R$ {product.price.toFixed(2)}
              </span>
              <span className="ml-4 text-sm text-gray-500">
                Estoque: {product.stock} unidades
              </span>
            </div>
            
            <div className="mb-4">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {product.category || 'Sem categoria'}
              </span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h2>
              <p className="text-gray-600">{product.description || 'Sem descrição'}</p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/products')}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
              >
                Voltar
              </button>
              
              {isAdmin && (
                <>
                  <Link
                    to={`/products/edit/${product.id}`}
                    className="flex-1 bg-yellow-500 text-white text-center py-2 px-4 rounded-md hover:bg-yellow-600 transition"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                  >
                    Deletar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;