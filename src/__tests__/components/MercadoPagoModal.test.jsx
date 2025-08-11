/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import { expect, it, jest, describe, beforeEach } from '@jest/globals';
import MercadoPagoModal from '../../components/MercadoPagoModal';
import { loadMercadoPagoSDK } from '../../utils/loadMercadoPago';
import { faker } from '@faker-js/faker';

jest.mock('../../utils/loadMercadoPago', () => ({
  loadMercadoPagoSDK: jest.fn(),
}));

describe('MercadoPagoModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const preferenceId = 'test_preference_id';
  const user = { name: faker.person.fullName(), email: faker.internet.email() };
  const amount = faker.number.float({ min: 10, max: 100 });

  beforeEach(() => {
    jest.clearAllMocks();
    loadMercadoPagoSDK.mockResolvedValue({
      bricks: jest.fn().mockReturnValue({
        create: jest.fn(),
      }),
    });
  });

  it('renders MercadoPagoModal and initializes MercadoPago SDK', async () => {
    render(
      <MercadoPagoModal
        preferenceId={preferenceId}
        user={user}
        amount={amount}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(loadMercadoPagoSDK).toHaveBeenCalled();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });
  });

  it('calls onSuccess with payment data on successful payment', async () => {
    const mockPaymentResponse = { status: 'approved', transactionId: '12345' };
    const mockFetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(mockPaymentResponse),
    });
    globalThis.fetch = mockFetch;
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
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/process_payment'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(mockPaymentResponse);
  });

  it('handles payment errors gracefully', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Payment error'));
    globalThis.fetch = mockFetch;
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
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/process_payment'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(screen.getByText('Payment error:')).toBeInTheDocument();
  });
});
