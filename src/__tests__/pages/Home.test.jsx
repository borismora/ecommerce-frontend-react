import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home';

describe('Home', () => {
  function renderHome() {
    return render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  }

  it('renders hero section with title and description', () => {
    renderHome();
    expect(screen.getByText(/Welcome to MyStore/i)).toBeInTheDocument();
    expect(screen.getByText(/Find the best products/i)).toBeInTheDocument();
  });

  it('renders "See products" button with correct link', () => {
    renderHome();
    const link = screen.getByRole('link', { name: /See products/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/products');
  });

  it('renders all category cards with correct names and links', () => {
    renderHome();
    const categories = [
      { name: 'Clothes', path: '/products?category=clothes', icon: '👕' },
      { name: 'Electronics', path: '/products?category=electronics', icon: '💻' },
      { name: 'Games', path: '/products?category=games', icon: '🎮' },
      { name: 'Offers', path: '/products?category=offers', icon: '🔥' },
    ];
    categories.forEach(({ name, path }) => {
      const link = screen.getByRole('link', { name: new RegExp(name, 'i') });
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe(path);
    });
  });

  it('renders trusted section with all features', () => {
    renderHome();
    expect(screen.getByText('Secure Payment')).toBeInTheDocument();
    expect(screen.getByText('Fast Shipping')).toBeInTheDocument();
    expect(screen.getByText('Easy Returns')).toBeInTheDocument();
  });

  it('renders all emojis/icons in categories and trusted sections', () => {
    renderHome();
    ['👕', '💻', '🎮', '🔥'].forEach((icon) => {
      expect(screen.getByText(icon)).toBeInTheDocument();
    });
    ['🔒', '🚚', '↩️'].forEach((emoji) => {
      expect(screen.getByText(emoji)).toBeInTheDocument();
    });
  });
});
