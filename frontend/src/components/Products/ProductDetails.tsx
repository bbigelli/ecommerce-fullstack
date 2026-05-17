import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import { Product } from '../../types';
import OptimizedImage from '../Common/OptimizedImage';
import WhatsAppButton from '../Common/WhatsAppButton';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';
import toast from 'react-hot-toast';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { deleteProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);  // ← tipado corretamente
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        const data = await productService.getProduct(parseInt(id));
        setProduct(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar produto';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${quantity}x ${product.name} adicionado(s) ao carrinho!`);
  }, [addToCart, product, quantity]);

  const handleDelete = useCallback(async () => {
    if (!product) return;
    if (!window.confirm(`Deletar "${product.name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteProduct(product.id);
      navigate('/products');
    } catch {
      toast.error('Erro ao deletar produto');
    }
  }, [deleteProduct, navigate, product]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Produto não encontrado" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-100 p-8">
            <OptimizedImage
              src={product.image_url}
              alt={product.name}
              className="w-full"
              height={400}
              objectFit="contain"
            />
          </div>

          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="mb-4">
              <span className="text-3xl font-bold text-blue-600">
                R$ {product.price.toFixed(2)}
              </span>
            </div>

            <div className="mb-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800 font-semibold">🎨 Produto Personalizado Sob Encomenda</p>
              <p className="text-sm text-yellow-700 mt-1">Não trabalhamos com estoque fixo. Cada peça é feita especialmente para você!</p>
            </div>

            {product.category && (
              <div className="mb-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                  {product.category}
                </span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'Sem descrição disponível.'}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
                  aria-label="Diminuir quantidade"
                >-</button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
                  aria-label="Aumentar quantidade"
                >+</button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-900 mb-2">Informações de Encomenda</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Prazo de produção: 15 a 30 dias úteis</li>
                <li>Pagamento: 50% de entrada, 50% na entrega</li>
                <li>Envio para todo Brasil via Correios</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  Adicionar ao Carrinho
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 transition"
                >
                  Voltar
                </button>
              </div>

              <WhatsAppButton productName={product.name} productId={product.id} />

              {isAdmin && (
                <div className="flex gap-3">
                  <Link
                    to={`/products/edit/${product.id}`}
                    className="flex-1 bg-yellow-500 text-white text-center py-2 px-4 rounded-md hover:bg-yellow-600 transition"
                  >
                    Editar Produto
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                  >
                    Deletar Produto
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;