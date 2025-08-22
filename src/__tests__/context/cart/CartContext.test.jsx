import { describe, it, expect } from 'vitest';
import { CartContext } from '../../../context/cart/CartContext';

describe('CartContext', () => {
  it('should be defined', () => {
    expect(CartContext).toBeDefined();
  });

  it('should have a Provider and Consumer', () => {
    expect(CartContext.Provider).toBeDefined();
    expect(CartContext.Consumer).toBeDefined();
  });

  it('should have a default value of undefined', () => {
    expect(CartContext._currentValue).toBeUndefined();
  });
});
