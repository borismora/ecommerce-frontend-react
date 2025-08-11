/**
 * @jest-environment jsdom
 */
import { expect, it, describe, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { faker } from '@faker-js/faker';

jest.mock('../../context/cart/useCart', () => ({
  useCart: jest.fn()
}));
jest.mock('../../context/auth/useAuth', () => ({
  useAuth: jest.fn()
}));

import { useCart } from '../../context/cart/useCart';
import { useAuth } from '../../context/auth/useAuth';

describe('Navbar', () => {
  let mockCartData;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCartData = [
      {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        quantity: faker.number.int({ min: 1, max: 5 })
      },
      {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        quantity: faker.number.int({ min: 1, max: 5 })
      }
    ];

    useAuth.mockReturnValue({
      user: null,
      performLogout: jest.fn()
    });

    useCart.mockReturnValue({
      cart: mockCartData
    });
  });

  it('renders the Navbar with default links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('MyStore')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('displays the correct number of items in the cart', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const totalItems = mockCartData.reduce((acc, item) => acc + item.quantity, 0);
    expect(screen.getByText(totalItems.toString())).toBeInTheDocument();
  });

  it('shows user name and logout when logged in', () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockLogout = jest.fn();

    useAuth.mockReturnValue({
      user: mockUser,
      performLogout: mockLogout
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Test User/)).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
