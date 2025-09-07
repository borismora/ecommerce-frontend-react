import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MiniCart from '../../components/MiniCart';
import { useCart } from '../../context/cart/useCart';
import { MemoryRouter } from 'react-router-dom';

// Mock useCart and useTranslation
vi.mock('../../context/cart/useCart');
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'miniCart.title': 'Mini Cart',
        'miniCart.emptyCart': 'Your cart is empty',
        'miniCart.buttonToCart': 'Go to Cart',
      };
      return translations[key] || key;
    },
  }),
}));

describe('MiniCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty cart message when cart is empty', () => {
    useCart.mockReturnValue({ cart: [] });

    render(
      <MemoryRouter>
        <MiniCart />
      </MemoryRouter>
    );

    expect(screen.getByText('Mini Cart')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.queryByText('Go to Cart')).not.toBeInTheDocument();
  });

  it('renders cart items and total when cart has items', () => {
    useCart.mockReturnValue({
      cart: [
        { id: 1, name: 'Product A', price: 1000, quantity: 2 },
        { id: 2, name: 'Product B', price: 500, quantity: 1 },
      ],
    });

    render(
      <MemoryRouter>
        <MiniCart />
      </MemoryRouter>
    );

    expect(screen.getByText('Mini Cart')).toBeInTheDocument();
    expect(screen.getByText('Product A x 2')).toBeInTheDocument();
    expect(screen.getByText('Product B x 1')).toBeInTheDocument();
    expect(screen.getByText('$2.000')).toBeInTheDocument(); // 1000*2
    expect(screen.getByText('$500')).toBeInTheDocument();   // 500*1
    expect(screen.getByText('Total: $2.500')).toBeInTheDocument();
    expect(screen.getByText('Go to Cart')).toBeInTheDocument();
  });

  it('renders correct total for multiple items', () => {
    useCart.mockReturnValue({
      cart: [
        { id: 1, name: 'Item 1', price: 200, quantity: 3 }, // 600
        { id: 2, name: 'Item 2', price: 150, quantity: 2 }, // 300
      ],
    });

    render(
      <MemoryRouter>
        <MiniCart />
      </MemoryRouter>
    );

    expect(screen.getByText('Total: $900')).toBeInTheDocument();
  });

  it('renders the link to /cart', () => {
    useCart.mockReturnValue({
      cart: [
        { id: 1, name: 'Item', price: 100, quantity: 1 },
      ],
    });

    render(
      <MemoryRouter>
        <MiniCart />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Go to Cart' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/cart');
  });
});
