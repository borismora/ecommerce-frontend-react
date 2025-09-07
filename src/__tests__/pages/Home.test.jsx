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
        'home.categories.title': 'Categories',
        'home.categories.clothes': 'Clothes',
        'home.categories.electronics': 'Electronics',
        'home.categories.games': 'Games',
        'home.categories.offers': 'Offers',
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
    expect(screen.getByText('Clothes')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Offers')).toBeInTheDocument();
  });

  it('renders category links with correct hrefs', () => {
    expect(screen.getByRole('link', { name: /Clothes/i })).toHaveAttribute('href', '/products?category=clothes');
    expect(screen.getByRole('link', { name: /Electronics/i })).toHaveAttribute('href', '/products?category=electronics');
    expect(screen.getByRole('link', { name: /Games/i })).toHaveAttribute('href', '/products?category=games');
    expect(screen.getByRole('link', { name: /Offers/i })).toHaveAttribute('href', '/products?category=offers');
  });

  it('renders trusted section with all features', () => {
    expect(screen.getByText('Secure Payment')).toBeInTheDocument();
    expect(screen.getByText('Fast Shipping')).toBeInTheDocument();
    expect(screen.getByText('Easy Returns')).toBeInTheDocument();
  });

  it('renders all emojis/icons', () => {
    expect(screen.getByText('👕')).toBeInTheDocument();
    expect(screen.getByText('💻')).toBeInTheDocument();
    expect(screen.getByText('🎮')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('🚚')).toBeInTheDocument();
    expect(screen.getByText('↩️')).toBeInTheDocument();
  });
});
