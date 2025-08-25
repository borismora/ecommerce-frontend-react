import { renderHook, act } from '@testing-library/react';
import { useCart } from '../../../context/cart/CartContext';
import { CartProvider } from '../../../context/cart/CartProvider';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useCart', () => {
  const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
  });

  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 1, name: 'Product 1', price: 10 };

    act(() => {
      result.current.addToCart(item);
    });

    expect(result.current.cart).toEqual([{ ...item, quantity: 1 }]);
  });

  it('should increase quantity if adding the same item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 1, name: 'Product 1', price: 10 };

    act(() => {
      result.current.addToCart(item);
      result.current.addToCart(item);
    });

    expect(result.current.cart).toEqual([{ ...item, quantity: 2 }]);
  });

  it('should remove an item from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 1, name: 'Product 1', price: 10 };

    act(() => {
      result.current.addToCart(item);
      result.current.removeFromCart(item.id);
    });

    expect(result.current.cart).toEqual([]);
  });

  it('should clear the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item1 = { id: 1, name: 'Product 1', price: 10 };
    const item2 = { id: 2, name: 'Product 2', price: 20 };

    act(() => {
      result.current.addToCart(item1);
      result.current.addToCart(item2);
      result.current.clearCart();
    });

    expect(result.current.cart).toEqual([]);
  });

  it('should decrease quantity if decreaseQuantity is called', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 1, name: 'Product 1', price: 10 };

    act(() => {
      result.current.addToCart(item);
      result.current.addToCart(item);
      result.current.decreaseQuantity(item.id);
    });

    expect(result.current.cart).toEqual([{ ...item, quantity: 1 }]);
  });

  it('should remove item if decreaseQuantity is called and quantity is 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 1, name: 'Product 1', price: 10 };

    act(() => {
      result.current.addToCart(item);
      result.current.decreaseQuantity(item.id);
    });

    expect(result.current.cart).toEqual([]);
  });
});
