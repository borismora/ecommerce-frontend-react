import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'home.welcome': 'Welcome!',
        'home.description': 'Best products for you.',
        'home.productsButton': 'See Products',
        'productFilters.categories.title': 'Categories',
        'productFilters.categories.groceries': 'Groceries',
        'productFilters.categories.laptops': 'Laptops',
        'productFilters.categories.smartphones': 'Smartphones',
        'productFilters.categories.vehicle': 'Vehicle',
        'home.footer.secure': 'Secure Payment',
        'home.footer.shipping': 'Fast Shipping',
        'home.footer.returns': 'Easy Returns',
      };
      return translations[key] || key;
    },
  }),
}));

describe('Home Page', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  });

  it('renders hero section with welcome message', () => {
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Best products for you.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See Products' })).toHaveAttribute('href', '/products');
  });

  it('renders categories section with all categories', () => {
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Laptops')).toBeInTheDocument();
    expect(screen.getByText('Smartphones')).toBeInTheDocument();
    expect(screen.getByText('Vehicle')).toBeInTheDocument();
  });

  it('renders category links with correct hrefs', () => {
    expect(screen.getByRole('link', { name: /Groceries/i })).toHaveAttribute('href', '/products?category=groceries');
    expect(screen.getByRole('link', { name: /Laptops/i })).toHaveAttribute('href', '/products?category=laptops');
    expect(screen.getByRole('link', { name: /Smartphones/i })).toHaveAttribute('href', '/products?category=smartphones');
    expect(screen.getByRole('link', { name: /Vehicle/i })).toHaveAttribute('href', '/products?category=vehicle');
  });

  it('renders trusted section with all features', () => {
    expect(screen.getByText('Secure Payment')).toBeInTheDocument();
    expect(screen.getByText('Fast Shipping')).toBeInTheDocument();
    expect(screen.getByText('Easy Returns')).toBeInTheDocument();
  });

  it('renders all emojis/icons', () => {
    expect(screen.getByText('🛒')).toBeInTheDocument();
    expect(screen.getByText('💻')).toBeInTheDocument();
    expect(screen.getByText('📱')).toBeInTheDocument();
    expect(screen.getByText('🚗')).toBeInTheDocument();
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('🚚')).toBeInTheDocument();
    expect(screen.getByText('↩️')).toBeInTheDocument();
  });
});
