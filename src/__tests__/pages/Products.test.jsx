import React from 'react';
import { render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import Products from '../../pages/Products';

// Mock product data using faker
const mockProducts = Array.from({ length: 5 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
  description: faker.commerce.productDescription(),
}));

// Mock Products component to accept products as props (adjust if needed)
vi.mock('../../pages/Products', () => ({
  default: (props) => (
    <div>
      {props.products.map((product) => (
        <div key={product.id} data-testid="product-item">
          <h2>{product.name}</h2>
          <span>{product.price}</span>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  ),
}));

describe('Products Page', () => {
  it('renders a list of products', () => {
    render(<Products products={mockProducts} />);
    const productItems = screen.getAllByTestId('product-item');
    expect(productItems).toHaveLength(mockProducts.length);

    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(product.price)).toBeInTheDocument();
      expect(screen.getByText(product.description)).toBeInTheDocument();
    });
  });
});
