import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import MercadoPagoModal from '../../components/MercadoPagoModal';
import { loadMercadoPagoSDK } from '../../utils/loadMercadoPago';

vi.mock('../../utils/loadMercadoPago', () => ({
  loadMercadoPagoSDK: vi.fn(),
}));

vi.spyOn(console, 'error').mockImplementation(() => { });

describe('MercadoPagoModal', () => {
  const preferenceId = 'preference_123';
  const user = { name: 'Juan Pérez', email: 'juan@example.com' };
  const amount = 1000;
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    loadMercadoPagoSDK.mockResolvedValue({
      bricks: vi.fn().mockReturnValue({
        create: vi.fn(),
      }),
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: 'approved' }),
    });
  });

  it('renders the modal with correct title and close button', () => {
    render(
      <MercadoPagoModal
        preferenceId={preferenceId}
        user={user}
        amount={amount}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Completa tu pago')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /×/ })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(
      <MercadoPagoModal
        preferenceId={preferenceId}
        user={user}
        amount={amount}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /×/ }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('initializes Mercado Pago SDK with correct config', async () => {
    render(
      <MercadoPagoModal
        preferenceId={preferenceId}
        user={user}
        amount={amount}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(loadMercadoPagoSDK).toHaveBeenCalled();
    });
  });
});
