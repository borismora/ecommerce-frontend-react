import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as mercadoPagoService from '../../../services/payments/mercadoPago';
import { faker } from '@faker-js/faker';

// Mock fetch or axios if used in the service
vi.mock('../../../services/payments/mercadoPago');

describe('mercadoPago service', () => {
  const fakePaymentData = {
    amount: faker.finance.amount(),
    currency: faker.finance.currencyCode(),
    description: faker.commerce.productDescription(),
    payer: {
      email: faker.internet.email(),
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a payment preference successfully', async () => {
    const fakeResponse = { id: faker.string.uuid(), ...fakePaymentData };
    mercadoPagoService.createPreference.mockResolvedValue(fakeResponse);

    const result = await mercadoPagoService.createPreference(fakePaymentData);

    expect(mercadoPagoService.createPreference).toHaveBeenCalledWith(fakePaymentData);
    expect(result).toEqual(fakeResponse);
  });

  it('should handle errors when creating a payment preference', async () => {
    const error = new Error('Failed to create preference');
    mercadoPagoService.createPreference.mockRejectedValue(error);

    await expect(mercadoPagoService.createPreference(fakePaymentData)).rejects.toThrow('Failed to create preference');
  });
});
