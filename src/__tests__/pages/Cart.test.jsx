import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../../pages/Cart';
import { BrowserRouter } from 'react-router-dom';
import { useCart as mockUseCart } from '../../context/cart/useCart';
import { faker } from '@faker-js/faker';

// Mock useCart hook
vi.mock('../../context/cart/useCart', () => ({
  useCart: vi.fn(),
}));

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('Cart page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty cart message and link', () => {
    mockUseCart.mockReturnValue({
      cart: [],
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
    });

    renderWithRouter(<Cart />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go back to products/i })).toBeInTheDocument();
  });

  it('renders cart items and total', () => {
    const cartItems = [
      {
        id: 1,
        name: faker.commerce.productName(),
        price: faker.commerce.price({ dec: 0 }),
        quantity: faker.number.int({ min: 1, max: 5 }),
        image: faker.image.url()
      },
      {
        id: 2,
        name: faker.commerce.productName(),
        price: faker.commerce.price({ dec: 0 }),
        quantity: faker.number.int({ min: 1, max: 5 }),
        image: faker.image.url()
      },
    ];
    const subTotals = cartItems.map(item => (item.price * item.quantity).toLocaleString());
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString();
    mockUseCart.mockReturnValue({
      cart: cartItems,
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
    });

    renderWithRouter(<Cart />);

    // Headers and items
    expect(screen.getByText(/your cart/i)).toBeInTheDocument();
    expect(screen.getByText(cartItems[0].name)).toBeInTheDocument();
    expect(screen.getByText(cartItems[1].name)).toBeInTheDocument();

    // Item prices
    expect(screen.getByText(`$${cartItems[0].price} x ${cartItems[0].quantity}`)).toBeInTheDocument();
    expect(screen.getByText(`$${cartItems[1].price} x ${cartItems[1].quantity}`)).toBeInTheDocument();

    // Subtotals - corrected matchers
    expect(screen.getByText((_, el) => el.textContent === `Subtotal: $${subTotals[0]}`)).toBeInTheDocument();
    expect(screen.getByText((_, el) => el.textContent === `Subtotal: $${subTotals[1]}`)).toBeInTheDocument();

    // Total
    expect(screen.getByText((_, el) => el.textContent === `Total: $${total}`)).toBeInTheDocument();
  });

  it('calls removeFromCart when Remove button is clicked', () => {
    const removeFromCart = vi.fn();
    const mockCart = [
      {
        id: 1,
        name: faker.commerce.productName(),
        price: faker.commerce.price({ dec: 0 }),
        quantity: faker.number.int({ min: 1, max: 5 }),
        image: faker.image.url()
      },
    ]
    mockUseCart.mockReturnValue({
      cart: mockCart,
      removeFromCart,
      clearCart: vi.fn(),
    });

    renderWithRouter(<Cart />);
    fireEvent.click(screen.getByText(/remove/i));
    expect(removeFromCart).toHaveBeenCalledWith(1);
  });

  it('calls clearCart when Clear Cart button is clicked', () => {
    const clearCart = vi.fn();
    const mockCart = [
      {
        id: 1,
        name: faker.commerce.productName(),
        price: faker.commerce.price({ dec: 0 }),
        quantity: faker.number.int({ min: 1, max: 5 }),
        image: faker.image.url()
      },
    ]
    mockUseCart.mockReturnValue({
      cart: mockCart,
      removeFromCart: vi.fn(),
      clearCart,
    });

    renderWithRouter(<Cart />);
    fireEvent.click(screen.getByText(/clear cart/i));
    expect(clearCart).toHaveBeenCalled();
  });

  it('shows Go to Checkout link when cart is not empty', () => {
    const mockCart = [
      {
        id: 1,
        name: faker.commerce.productName(),
        price: faker.commerce.price({ dec: 0 }),
        quantity: faker.number.int({ min: 1, max: 5 }),
        image: faker.image.url()
      },
    ]
    mockUseCart.mockReturnValue({
      cart: mockCart,
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
    });

    renderWithRouter(<Cart />);
    expect(screen.getByRole('link', { name: /go to checkout/i })).toBeInTheDocument();
  });

  it('does not show Go to Checkout link when cart is empty', () => {
    mockUseCart.mockReturnValue({
      cart: [],
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
    });

    renderWithRouter(<Cart />);
    expect(screen.queryByRole('link', { name: /go to checkout/i })).not.toBeInTheDocument();
  });
});
