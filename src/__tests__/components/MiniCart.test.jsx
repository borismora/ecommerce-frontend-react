import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MiniCart from '../../components/MiniCart';
import { BrowserRouter } from 'react-router-dom';
import { useCart } from '../../context/cart/useCart';

// Mock useCart hook
vi.mock('../../context/cart/useCart', () => ({
  useCart: vi.fn(),
}));
const mockUseCart = vi.mocked(useCart);


function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('MiniCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty cart message when cart is empty', () => {
    mockUseCart.mockReturnValue({ cart: [] });
    renderWithRouter(<MiniCart />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByText(/total:/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /go to cart/i })).not.toBeInTheDocument();
  });

  it('renders cart items and total when cart has items', () => {
    mockUseCart.mockReturnValue({
      cart: [
        { id: 1, name: 'Product A', price: 100, quantity: 2 },
        { id: 2, name: 'Product B', price: 50, quantity: 1 },
      ],
    });
    renderWithRouter(<MiniCart />);
    expect(screen.getByText(/product a x 2/i)).toBeInTheDocument();
    expect(screen.getByText(/product b x 1/i)).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText(/total: \$250/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to cart/i })).toHaveAttribute('href', '/cart');
  });

  it('renders correct total for multiple items', () => {
    mockUseCart.mockReturnValue({
      cart: [
        { id: 1, name: 'Item 1', price: 10, quantity: 3 },
        { id: 2, name: 'Item 2', price: 20, quantity: 2 },
      ],
    });
    renderWithRouter(<MiniCart />);
    expect(screen.getByText(/total: \$70/i)).toBeInTheDocument();
  });

  it('renders formatted prices with thousands separator', () => {
    mockUseCart.mockReturnValue({
      cart: [
        { id: 1, name: 'Expensive', price: 1000, quantity: 2 },
      ],
    });
    renderWithRouter(<MiniCart />);
    expect(screen.getByText('$2.000')).toBeInTheDocument();
    expect(screen.getByText(/total: \$2.000/i)).toBeInTheDocument();
  });

  it('renders correct number of cart items', () => {
    mockUseCart.mockReturnValue({
      cart: [
        { id: 1, name: 'A', price: 1, quantity: 1 },
        { id: 2, name: 'B', price: 2, quantity: 2 },
        { id: 3, name: 'C', price: 3, quantity: 3 },
      ],
    });
    renderWithRouter(<MiniCart />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
