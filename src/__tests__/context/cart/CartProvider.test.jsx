import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useContext } from 'react';
import { CartProvider } from '../../../context/cart/CartProvider';
import { CartContext } from '../../../context/cart/CartContext';

// Helper component to access context
function TestComponent({ onRender }) {
  const ctx = useContext(CartContext);
  onRender(ctx);
  return null;
}

describe('CartProvider', () => {
  let onRender;
  let originalLocalStorage;

  beforeEach(() => {
    onRender = vi.fn();
    // Mock localStorage
    originalLocalStorage = globalThis.localStorage;
    let store = {};
    globalThis.localStorage = {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value; }),
      removeItem: vi.fn((key) => { delete store[key]; }),
      clear: vi.fn(() => { store = {}; }),
    };
  });

  afterEach(() => {
    globalThis.localStorage = originalLocalStorage;
    vi.clearAllMocks();
  });

  it('loads cart from localStorage on mount', () => {
    const cartData = [{ id: 1, name: 'Test', quantity: 2 }];
    globalThis.localStorage.getItem.mockReturnValueOnce(JSON.stringify(cartData));
    render(
      <CartProvider>
        <TestComponent onRender={onRender} />
      </CartProvider>
    );
    expect(onRender).toHaveBeenCalledWith(
      expect.objectContaining({ cart: cartData, addToCart: expect.any(Function) })
    );
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    globalThis.localStorage.getItem.mockReturnValueOnce('invalid json');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    render(
      <CartProvider>
        <TestComponent onRender={onRender} />
      </CartProvider>
    );
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('adds a new product to cart', () => {
    render(
      <CartProvider>
        <TestComponent onRender={onRender} />
      </CartProvider>
    );
    const { addToCart } = onRender.mock.calls[0][0];
    act(() => {
      addToCart({ id: 1, name: 'Test' });
    });
    expect(onRender.mock.lastCall[0].cart).toEqual([{ id: 1, name: 'Test', quantity: 1 }]);
  });

  it('increments quantity if product already in cart', () => {
    render(
      <CartProvider>
        <TestComponent onRender={onRender} />
      </CartProvider>
    );
    const { addToCart } = onRender.mock.calls[0][0];
    act(() => {
      addToCart({ id: 1, name: 'Test' });
      addToCart({ id: 1, name: 'Test' });
    });
    expect(onRender.mock.lastCall[0].cart).toEqual([{ id: 1, name: 'Test', quantity: 2 }]);
  });

  it('removes a product from cart', () => {
    render(
      <CartProvider>
        <TestComponent onRender={onRender} />
      </CartProvider>
    );
    const { addToCart, removeFromCart } = onRender.mock.calls[0][0];
    act(() => {
      addToCart({ id: 1, name: 'Test' });
      addToCart({ id: 2, name: 'Test2' });
      removeFromCart(1);
    });
    expect(onRender.mock.lastCall[0].cart).toEqual([{ id: 2, name: 'Test2', quantity: 1 }]);
  });

  it('clears the cart', () => {
    render(
      <CartProvider>
        <TestComponent onRender={onRender} />
      </CartProvider>
    );
    const { addToCart, clearCart } = onRender.mock.calls[0][0];
    act(() => {
      addToCart({ id: 1, name: 'Test' });
      clearCart();
    });
    expect(onRender.mock.lastCall[0].cart).toEqual([]);
  });

  it('persists cart to localStorage after changes', () => {
    render(
      <CartProvider>
        <TestComponent onRender={onRender} />
      </CartProvider>
    );
    const { addToCart } = onRender.mock.calls[0][0];
    act(() => {
      addToCart({ id: 1, name: 'Test' });
    });
    expect(globalThis.localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([{ id: 1, name: 'Test', quantity: 1 }])
    );
  });
});
