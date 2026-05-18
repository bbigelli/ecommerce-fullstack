import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext';
import ProductCard from './ProductCard';
import Loading from '../Common/Loading';
import ErrorMessage from '../Common/ErrorMessage';

const ProductList: React.FC = () => {
  const { products, loading, fetchProducts } = useProducts();
  const { isAdmin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setError(null);
      try {
        await fetchProducts();
      } catch (err) {
        setError('Não foi possível carregar os produtos. Verifique se o servidor está rodando.');
        console.error('Erro ao carregar produtos:', err);
      }
    };
    
    loadProducts();
  }, []); // Array vazio - executa apenas uma vez na montagem

  const filtered = search.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div className="page-container">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nossos Produtos</h1>
        {isAdmin && (
          <Link
            to="/products/new"
            className="btn-primary self-start sm:self-auto"
            aria-label="Criar novo produto"
          >
            + Novo Produto
          </Link>
        )}
      </div>

      {/* Campo de busca */}
      <div className="mb-6 max-w-sm">
        <label htmlFor="search-products" className="form-label">Buscar produtos</label>
        <input
          id="search-products"
          type="search"
          placeholder="Nome ou categoria…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input"
          aria-controls="products-grid"
        />
      </div>

      {/* Conteúdo */}
      {loading ? (
        <Loading label="Carregando produtos…" />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => {
          setError(null);
          fetchProducts().catch(() => setError('Não foi possível carregar os produtos.'));
        }} />
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-16 text-lg" role="status">
          {search ? `Nenhum produto encontrado para "${search}".` : 'Nenhum produto cadastrado.'}
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4" aria-live="polite">
            {filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
          <ul
            id="products-grid"
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
            role="list"
            aria-label="Lista de produtos"
          >
            {filtered.map(product => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ProductList;