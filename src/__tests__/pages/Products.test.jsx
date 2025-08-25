import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import Products from '../../pages/Products';
import * as useCartModule from '../../context/cart/useCart';
import * as productsData from '../../data/products';
import { faker } from '@faker-js/faker';

function generateFakeProduct() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()),
    image: faker.image.url(),
  };
}

describe('Products Page', () => {
  let addToCartMock;

  beforeEach(() => {
    addToCartMock = vi.fn();
    vi.spyOn(useCartModule, 'useCart').mockReturnValue({ addToCart: addToCartMock });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all products', () => {
    const fakeProducts = Array.from({ length: 4 }, generateFakeProduct);
    vi.spyOn(productsData, 'default', 'get').mockReturnValue(fakeProducts);

    render(<Products />);
    fakeProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(`$${product.price.toLocaleString()}`)).toBeInTheDocument();
      expect(screen.getByAltText(product.name)).toHaveAttribute('src', product.image);
    });
  });

  it('calls addToCart when "Add to Cart" button is clicked', () => {
    const fakeProducts = Array.from({ length: 2 }, generateFakeProduct);
    vi.spyOn(productsData, 'default', 'get').mockReturnValue(fakeProducts);

    render(<Products />);
    const buttons = screen.getAllByRole('button', { name: /add to cart/i });
    fireEvent.click(buttons[0]);
    expect(addToCartMock).toHaveBeenCalledWith(fakeProducts[0]);
  });

  it('renders correct number of "Add to Cart" buttons', () => {
    const fakeProducts = Array.from({ length: 3 }, generateFakeProduct);
    vi.spyOn(productsData, 'default', 'get').mockReturnValue(fakeProducts);

    render(<Products />);
    expect(screen.getAllByRole('button', { name: /add to cart/i })).toHaveLength(3);
  });

  it('renders product images with correct alt text', () => {
    const fakeProducts = Array.from({ length: 2 }, generateFakeProduct);
    vi.spyOn(productsData, 'default', 'get').mockReturnValue(fakeProducts);

    render(<Products />);
    fakeProducts.forEach(product => {
      expect(screen.getByAltText(product.name)).toBeInTheDocument();
    });
  });
});
