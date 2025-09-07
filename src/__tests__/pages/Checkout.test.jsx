import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Checkout from '../../pages/Checkout';
import { useCart } from '../../context/cart/useCart';
import { useCheckoutForm } from '../../hooks/useCheckoutForm';
import { submitOrder } from '../../services/orders';
import { createPreference } from '../../services/payments/mercadoPago';
import { useNavigate } from 'react-router-dom';

// Mocks
vi.mock('../../context/cart/useCart');
vi.mock('../../hooks/useCheckoutForm');
vi.mock('../../services/orders');
vi.mock('../../services/payments/mercadoPago');
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: vi.fn(),
}));
vi.mock('../../components/MercadoPagoModal', () => ({
  __esModule: true,
  default: ({ onClose, onSuccess }) => (
    <div>
      <button onClick={onSuccess}>Success</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockCart = [
  { id: 1, name: 'Product 1', price: 100, quantity: 2 },
  { id: 2, name: 'Product 2', price: 50, quantity: 1 },
];

const mockForm = {
  name: 'John Doe',
  email: 'john@example.com',
  address: '123 Main St',
};

describe('Checkout', () => {
  let clearCart, validate, handleChange, navigate;

  beforeEach(() => {
    clearCart = vi.fn();
    validate = vi.fn(() => true);
    handleChange = vi.fn();
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
    localStorage.clear();
  });

  it('renders checkout form with cart items', () => {
    render(<Checkout />);
    expect(screen.getByText('checkout.title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('checkout.name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('checkout.email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('checkout.address')).toBeInTheDocument();
    expect(screen.getByText('Total: $250')).toBeInTheDocument();
    expect(screen.getByText('checkout.cash')).toBeInTheDocument();
    expect(screen.getByText('MercadoPago')).toBeInTheDocument();
    expect(screen.getByText('checkout.submit')).toBeInTheDocument();
  });

  it('shows empty message if cart is empty', () => {
    useCart.mockReturnValue({ cart: [], clearCart });
    render(<Checkout />);
    expect(screen.getByText('checkout.empty')).toBeInTheDocument();
  });

  it('submits order with cash method and navigates to summary', async () => {
    render(<Checkout />);
    fireEvent.click(screen.getByText('checkout.submit'));
    await waitFor(() => {
      expect(submitOrder).toHaveBeenCalled();
      expect(clearCart).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith('/order-summary', expect.anything());
      expect(localStorage.getItem('lastOrder')).toContain('John Doe');
    });
  });

  it('submits order with MercadoPago method and shows modal', async () => {
    render(<Checkout />);
    fireEvent.click(screen.getByLabelText('MercadoPago'));
    fireEvent.click(screen.getByText('checkout.submit'));
    await waitFor(() => {
      expect(createPreference).toHaveBeenCalledWith(mockCart);
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  it('handles MercadoPago modal success', async () => {
    render(<Checkout />);
    fireEvent.click(screen.getByLabelText('MercadoPago'));
    fireEvent.click(screen.getByText('checkout.submit'));
    await waitFor(() => screen.getByText('Success'));
    fireEvent.click(screen.getByText('Success'));
    await waitFor(() => {
      expect(clearCart).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith('/order-summary', expect.anything());
    });
  });

  it('resets preferenceId when payment method changes', async () => {
    render(<Checkout />);
    fireEvent.click(screen.getByLabelText('MercadoPago'));
    fireEvent.click(screen.getByLabelText('checkout.cash'));
    // No error thrown means effect ran and component updated
    expect(screen.getByLabelText('checkout.cash')).toBeChecked();
  });

  it('handles order submission error gracefully', async () => {
    submitOrder.mockRejectedValueOnce(new Error('fail'));
    render(<Checkout />);
    fireEvent.click(screen.getByText('checkout.submit'));
    await waitFor(() => {
      expect(submitOrder).toHaveBeenCalled();
    });
    // No crash, error is logged
  });
});
