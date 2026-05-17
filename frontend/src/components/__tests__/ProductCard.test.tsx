import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../Products/ProductCard';

const mockProduct = {
  id: 1, name: 'Vaso Artesanal', price: 89.90,
  description: 'Lindo vaso', stock: 0, category: 'Decoração',
  image_url: '', is_available: true,
  created_at: '', updated_at: '', owner_id: 1
};

// Mock contexts
jest.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ isAdmin: false }) }));
jest.mock('../../contexts/CartContext', () => ({ useCart: () => ({ addToCart: jest.fn() }) }));
jest.mock('../../contexts/ProductContext', () => ({ useProducts: () => ({ deleteProduct: jest.fn() }) }));

test('exibe nome e preço do produto', () => {
  render(<MemoryRouter><ProductCard product={mockProduct} /></MemoryRouter>);
  expect(screen.getByText('Vaso Artesanal')).toBeInTheDocument();
  expect(screen.getByText(/89,90/)).toBeInTheDocument();
});