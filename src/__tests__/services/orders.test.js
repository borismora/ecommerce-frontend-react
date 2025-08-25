import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as ordersService from '../../services/orders';
import api from '../../lib/api';

// Mock api.post
vi.mock('../../lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('submitOrder', () => {
  beforeEach(() => {
    api.post.mockClear();
  });

  it('should call api.post with correct endpoint and data', async () => {
    const mockOrder = {
      user: { id: 'user1', name: 'John Doe' },
      items: [
        { id: 'item1', name: 'Product 1', quantity: 2 },
        { id: 'item2', name: 'Product 2', quantity: 1 },
      ],
      total: 99.99,
    };
    api.post.mockResolvedValueOnce({ data: { success: true } });

    const result = await ordersService.submitOrder(mockOrder);

    expect(api.post).toHaveBeenCalledWith('/posts', mockOrder);
    expect(result).toEqual({ data: { success: true } });
  });

  it('should handle empty items array', async () => {
    const mockOrder = {
      user: { id: 'user2', name: 'Jane Doe' },
      items: [],
      total: 0,
    };
    api.post.mockResolvedValueOnce({ data: { success: true } });

    const result = await ordersService.submitOrder(mockOrder);

    expect(api.post).toHaveBeenCalledWith('/posts', mockOrder);
    expect(result).toEqual({ data: { success: true } });
  });

  it('should propagate errors from api.post', async () => {
    const mockOrder = {
      user: { id: 'user3', name: 'Error User' },
      items: [{ id: 'item3', name: 'Product 3', quantity: 1 }],
      total: 10,
    };
    const error = new Error('Network error');
    api.post.mockRejectedValueOnce(error);

    await expect(ordersService.submitOrder(mockOrder)).rejects.toThrow('Network error');
  });

  it('should work with random (faker-like) data', async () => {
    // Simulate faker data
    const randomOrder = {
      user: { id: 'user' + Math.random(), name: 'User ' + Math.random() },
      items: [
        { id: 'item' + Math.random(), name: 'Product ' + Math.random(), quantity: Math.floor(Math.random() * 5) + 1 },
      ],
      total: Math.random() * 100,
    };
    api.post.mockResolvedValueOnce({ data: { success: true } });

    const result = await ordersService.submitOrder(randomOrder);

    expect(api.post).toHaveBeenCalledWith('/posts', randomOrder);
    expect(result).toEqual({ data: { success: true } });
  });
});
