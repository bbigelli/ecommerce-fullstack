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

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const loadProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProduct(parseInt(id, 10));
      setProduct(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar produto';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadProduct(); }, [loadProduct]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${quantity}x "${product.name}" adicionado${quantity > 1 ? 's' : ''} ao carrinho!`);
  }, [addToCart, product, quantity]);

  const handleDelete = useCallback(async () => {
    if (!product) return;
    if (!window.confirm(`Deletar "${product.name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteProduct(product.id);
      navigate('/products');
    } catch {
      // Erro já exibido pelo context
    }
  }, [deleteProduct, navigate, product]);

  if (loading) return <Loading label="Carregando produto…" />;
  if (error)   return <ErrorMessage message={error} onRetry={loadProduct} />;
  if (!product) return <ErrorMessage message="Produto não encontrado." />;

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav aria-label="Caminho de navegação" className="mb-6 text-sm text-gray-500">
        <ol className="flex items-center gap-1.5 list-none flex-wrap">
          <li><Link to="/" className="hover:text-gray-700 transition-colors">Início</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/products" className="hover:text-gray-700 transition-colors">Produtos</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-gray-900 font-medium line-clamp-1 max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      <article className="card max-w-5xl mx-auto" aria-label={`Detalhes: ${product.name}`}>
        <div className="flex flex-col md:flex-row">

          {/* Imagem */}
          <div className="md:w-2/5 bg-gray-50 flex items-center justify-center p-6 sm:p-8 min-h-[240px] sm:min-h-[320px]">
            <OptimizedImage
              src={product.image_url ?? ''}
              alt={`Foto de ${product.name}`}
              className="w-full max-h-80 md:max-h-96"
              objectFit="contain"
            />
          </div>

          {/* Info */}
          <div className="md:w-3/5 p-5 sm:p-8 flex flex-col gap-5">

            <div>
              {/* h1 único — nome do produto */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.category && (
                <span className="badge">{product.category}</span>
              )}
            </div>

            <p className="price text-3xl">
              <span className="sr-only">Preço:</span>
              R$ {product.price.toFixed(2)}
            </p>

            {/* Banner encomenda */}
            <div className="order-banner" role="note" aria-label="Produto sob encomenda">
              <p className="text-sm font-semibold text-yellow-800">🎨 Produto Personalizado Sob Encomenda</p>
              <p className="text-sm text-yellow-700 mt-0.5">
                Cada peça é feita especialmente para você. Sem estoque fixo.
              </p>
            </div>

            {/* Descrição */}
            {product.description && (
              <section aria-labelledby="desc-title">
                <h2 id="desc-title" className="text-base font-semibold text-gray-800 mb-1">Descrição</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </section>
            )}

            {/* Informações de encomenda */}
            <section aria-labelledby="info-title">
              <h2 id="info-title" className="text-base font-semibold text-gray-800 mb-2">
                Informações de Encomenda
              </h2>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Prazo de produção: 15 a 30 dias úteis</li>
                <li>Pagamento: 50% de entrada, 50% na entrega</li>
                <li>Envio para todo o Brasil via Correios</li>
              </ul>
            </section>

            {/* Controle de quantidade */}
            <div>
              <label className="form-label" id="qty-label">Quantidade</label>
              <div className="flex items-center gap-3 mt-1" role="group" aria-labelledby="qty-label">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="qty-btn"
                  type="button"
                  aria-label="Diminuir quantidade"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <output
                  htmlFor="qty-label"
                  className="text-xl font-semibold w-10 text-center"
                  aria-live="polite"
                >
                  {quantity}
                </output>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="qty-btn"
                  type="button"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col xs:flex-row gap-2">
                <button onClick={handleAddToCart} className="btn-success flex-1" type="button">
                  Adicionar ao Carrinho
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="btn-secondary flex-1"
                  type="button"
                >
                  Voltar
                </button>
              </div>

              <WhatsAppButton productName={product.name} productId={product.id} />

              {isAdmin && (
                <div className="flex gap-2 pt-2 border-t border-gray-100" role="group" aria-label="Ações de administrador">
                  <Link
                    to={`/products/edit/${product.id}`}
                    className="btn-warning flex-1"
                    aria-label={`Editar ${product.name}`}
                  >
                    Editar
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="btn-danger flex-1"
                    type="button"
                    aria-label={`Deletar ${product.name}`}
                  >
                    Deletar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ProductDetails;