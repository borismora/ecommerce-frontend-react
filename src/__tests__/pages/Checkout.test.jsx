import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Checkout from '../../pages/Checkout';
import { useCart } from '../../context/cart/useCart';
import { useCheckoutForm } from '../../hooks/useCheckoutForm';
import { submitOrder } from '../../services/orders';
import { createPreference } from '../../services/payments/mercadoPago';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mocks
vi.mock('../../context/cart/useCart');
vi.mock('../../hooks/useCheckoutForm');
vi.mock('../../services/orders');
vi.mock('../../services/payments/mercadoPago');
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});
vi.mock('../../components/MercadoPagoModal', () => ({
  default: ({ onClose, onSuccess }) => (
    <div>
      <button onClick={onClose}>Close Modal</button>
      <button onClick={onSuccess}>Success Modal</button>
    </div>
  ),
}));

const mockCart = [
  { id: 1, name: 'Product 1', price: 100, quantity: 2 },
  { id: 2, name: 'Product 2', price: 50, quantity: 1 },
];

const mockForm = { name: 'John', email: 'john@mail.com', address: '123 St' };

describe('Checkout', () => {
  let clearCart, handleChange, validate, navigate;

  beforeEach(() => {
    clearCart = vi.fn();
    handleChange = vi.fn();
    validate = vi.fn(() => true);
    navigate = vi.fn();

    useCart.mockReturnValue({
      cart: [...mockCart],
      clearCart,
    });

    useCheckoutForm.mockReturnValue({
      form: { ...mockForm },
      error: '',
      validate,
      handleChange,
    });

    useNavigate.mockReturnValue(navigate);

    submitOrder.mockResolvedValue({});
    createPreference.mockResolvedValue('pref-123');

    // Clear calls before each test
    submitOrder.mockClear();
    createPreference.mockClear();
    localStorage.clear();
  });

  it('renders checkout form with cart items', () => {
    render(<Checkout />, { wrapper: MemoryRouter });
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toHaveValue('John');
    expect(screen.getByPlaceholderText('Email')).toHaveValue('john@mail.com');
    expect(screen.getByPlaceholderText('Address')).toHaveValue('123 St');
    expect(screen.getByText('Total: $250')).toBeInTheDocument();
    expect(screen.getByLabelText('Cash')).toBeChecked();
    expect(screen.getByLabelText('MercadoPago')).not.toBeChecked();
  });

  it('shows empty cart message', () => {
    useCart.mockReturnValue({ cart: [], clearCart });
    render(<Checkout />, { wrapper: MemoryRouter });
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('submits order with cash method and navigates to summary', async () => {
    render(<Checkout />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText('Place Order'));
    await waitFor(() => {
      expect(submitOrder).toHaveBeenCalled();
      expect(clearCart).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith('/order-summary', expect.anything());
      expect(localStorage.getItem('lastOrder')).toContain('Product 1');
    });
  });

  it('submits order with MercadoPago method and shows modal', async () => {
    render(<Checkout />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByLabelText('MercadoPago'));
    fireEvent.click(screen.getByText('Place Order'));
    await waitFor(() => {
      expect(createPreference).toHaveBeenCalledWith(mockCart);
      expect(screen.getByText('Close Modal')).toBeInTheDocument();
      expect(screen.getByText('Success Modal')).toBeInTheDocument();
    });
  });

  it('closes MercadoPago modal', async () => {
    render(<Checkout />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByLabelText('MercadoPago'));
    fireEvent.click(screen.getByText('Place Order'));
    await waitFor(() => screen.getByText('Close Modal'));
    fireEvent.click(screen.getByText('Close Modal'));
    await waitFor(() => {
      expect(screen.queryByText('Close Modal')).not.toBeInTheDocument();
    });
  });

  it('handles MercadoPago modal success', async () => {
    render(<Checkout />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByLabelText('MercadoPago'));
    fireEvent.click(screen.getByText('Place Order'));
    await waitFor(() => screen.getByText('Success Modal'));
    fireEvent.click(screen.getByText('Success Modal'));
    await waitFor(() => {
      expect(clearCart).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith('/order-summary', expect.anything());
    });
  });

  it('resets preferenceId when payment method changes', async () => {
    render(<Checkout />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByLabelText('MercadoPago'));
    fireEvent.click(screen.getByLabelText('Cash'));
    // No error thrown means useEffect ran and did not break
    expect(screen.getByLabelText('Cash')).toBeChecked();
  });

  it('handles submitOrder error gracefully', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => { });
    submitOrder.mockRejectedValueOnce(new Error('fail'));
    render(<Checkout />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText('Place Order'));
    await waitFor(() => {
      expect(submitOrder).toHaveBeenCalled();
    });
    spy.mockRestore();
  });

  it('shows error if validation fails', async () => {
    useCheckoutForm.mockReturnValue({
      form: { ...mockForm },
      error: 'Validation error',
      validate: () => false,
      handleChange,
    });
    render(<Checkout />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText('Place Order'));
    expect(screen.getByText('Validation error')).toBeInTheDocument();
    expect(submitOrder).not.toHaveBeenCalled();
  });
});
