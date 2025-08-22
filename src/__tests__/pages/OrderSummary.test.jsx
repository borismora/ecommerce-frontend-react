import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OrderSummary from '../../pages/OrderSummary';
import { faker } from '@faker-js/faker';

// Helper to render with router and optional state
function renderWithRouter(ui, { route = '/', state = undefined } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[{ pathname: route, state }]}>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

const fakeOrder = () => ({
  user: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
  },
  items: [
    {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 5 }),
      price: faker.number.int({ min: 10, max: 100 }),
    },
    {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 5 }),
      price: faker.number.int({ min: 10, max: 100 }),
    },
  ],
  total: 0,
});

function calculateTotal(order) {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

describe('OrderSummary', () => {
  let order;

  beforeEach(() => {
    order = fakeOrder();
    order.total = calculateTotal(order);
    vi.spyOn(window.localStorage.__proto__, 'getItem');
    vi.spyOn(window.localStorage.__proto__, 'setItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('renders order summary from location state', () => {
    renderWithRouter(<OrderSummary />, {
      state: { order },
    });

    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(order.user.name))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(order.user.email))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(order.user.address))).toBeInTheDocument();

    order.items.forEach(item => {
      expect(screen.getByText(new RegExp(item.name))).toBeInTheDocument();
      expect(screen.getByText(`$${(item.price * item.quantity).toLocaleString()}`)).toBeInTheDocument();
    });

    expect(screen.getByText(`Total: $${order.total.toLocaleString()}`)).toBeInTheDocument();
  });

  it('renders order summary from localStorage if no state', () => {
    window.localStorage.setItem('lastOrder', JSON.stringify(order));
    renderWithRouter(<OrderSummary />);

    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(order.user.name))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(order.user.email))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(order.user.address))).toBeInTheDocument();
    expect(screen.getByText(`Total: $${order.total.toLocaleString()}`)).toBeInTheDocument();
  });

  it('shows error message if no order in state or localStorage', () => {
    renderWithRouter(<OrderSummary />);
    expect(screen.getByText('No order found. Please try again.')).toBeInTheDocument();
    expect(screen.getByText('Go back to Checkout')).toBeInTheDocument();
  });

  it('renders correct number of items', () => {
    renderWithRouter(<OrderSummary />, { state: { order } });
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(order.items.length);
  });

  it('renders formatted prices and total', () => {
    renderWithRouter(<OrderSummary />, { state: { order } });
    order.items.forEach(item => {
      const price = `$${(item.price * item.quantity).toLocaleString()}`;
      expect(screen.getByText(price)).toBeInTheDocument();
    });
    expect(screen.getByText(`Total: $${order.total.toLocaleString()}`)).toBeInTheDocument();
  });
});
