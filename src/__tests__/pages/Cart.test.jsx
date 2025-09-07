import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../../pages/Cart';
import { useCart } from '../../context/cart/useCart';
import { BrowserRouter } from 'react-router-dom';
import { vi, afterEach, describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';

// Mock useCart and useTranslation
vi.mock('../../context/cart/useCart');
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

const createFakeCartItem = () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: Number(faker.commerce.price({ min: 10, max: 1000 })),
  quantity: faker.number.int({ min: 1, max: 5 }),
  image: faker.image.url(),
});

describe('Cart page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty cart message and link', () => {
    useCart.mockReturnValue({
      cart: [],
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
    });

    renderWithRouter(<Cart />);
    expect(screen.getByText('cart.empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'cart.goToProducts' })).toHaveAttribute('href', '/products');
  });

  it('renders cart items and total', () => {
    const fakeItems = Array.from({ length: 2 }, createFakeCartItem);
    useCart.mockReturnValue({
      cart: fakeItems,
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
    });

    renderWithRouter(<Cart />);
    fakeItems.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByAltText(item.name)).toHaveAttribute('src', item.image);
      expect(screen.getByText(`$${item.price.toLocaleString()} x ${item.quantity}`)).toBeInTheDocument();
      expect(screen.getByText(`Subtotal: $${(item.price * item.quantity).toLocaleString()}`)).toBeInTheDocument();
    });

    const total = fakeItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    expect(screen.getByText(`Total: $${total.toLocaleString()}`)).toBeInTheDocument();
  });

  it('calls removeFromCart when remove button is clicked', () => {
    const fakeItem = createFakeCartItem();
    const removeFromCart = vi.fn();
    useCart.mockReturnValue({
      cart: [fakeItem],
      removeFromCart,
      clearCart: vi.fn(),
    });

    renderWithRouter(<Cart />);
    fireEvent.click(screen.getByRole('button', { name: 'cart.remove' }));
    expect(removeFromCart).toHaveBeenCalledWith(fakeItem.id);
  });

  it('calls clearCart when clear button is clicked', () => {
    const fakeItem = createFakeCartItem();
    const clearCart = vi.fn();
    useCart.mockReturnValue({
      cart: [fakeItem],
      removeFromCart: vi.fn(),
      clearCart,
    });

    renderWithRouter(<Cart />);
    fireEvent.click(screen.getByRole('button', { name: 'cart.clear' }));
    expect(clearCart).toHaveBeenCalled();
  });

  it('shows checkout link when cart is not empty', () => {
    const fakeItem = createFakeCartItem();
    useCart.mockReturnValue({
      cart: [fakeItem],
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
    });

    renderWithRouter(<Cart />);
    expect(screen.getByRole('link', { name: 'cart.checkout' })).toHaveAttribute('href', '/checkout');
  });

  it('does not show checkout link when cart is empty', () => {
    useCart.mockReturnValue({
      cart: [],
      removeFromCart: vi.fn(),
      clearCart: vi.fn(),
    });

    renderWithRouter(<Cart />);
    expect(screen.queryByRole('link', { name: 'cart.checkout' })).not.toBeInTheDocument();
  });
});
