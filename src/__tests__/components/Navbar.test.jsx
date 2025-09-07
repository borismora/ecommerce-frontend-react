import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../components/Navbar';
import { BrowserRouter } from 'react-router-dom';

// Mocks
vi.mock('../../components/MiniCart', () => ({
  default: () => <div data-testid="minicart">MiniCart</div>,
}));
vi.mock('lucide-react', () => ({
  ShoppingCart: (props) => <svg data-testid="shopping-cart" {...props} />,
}));

const mockCart = [
  { id: 1, name: 'Product 1', quantity: 2 },
  { id: 2, name: 'Product 2', quantity: 1 },
];

const mockUseCart = vi.fn();
const mockUseAuth = vi.fn();
const mockUseLanguage = vi.fn();
const mockUseTranslation = vi.fn();

vi.mock('../../context/cart/useCart', () => ({
  useCart: () => mockUseCart(),
}));
vi.mock('../../context/auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));
vi.mock('../../context/language/useLanguage', () => ({
  useLanguage: () => mockUseLanguage(),
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

function renderNavbar() {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
}

beforeEach(() => {
  mockUseCart.mockReturnValue({ cart: [] });
  mockUseAuth.mockReturnValue({ user: null, performLogout: vi.fn() });
  mockUseLanguage.mockReturnValue({
    language: 'en',
    changeLanguage: vi.fn(),
  });
  mockUseTranslation.mockReturnValue({
    t: (key) => key,
  });
});

describe('Navbar', () => {
  it('renders store name', () => {
    renderNavbar();
    expect(screen.getByText('MyStore')).toBeInTheDocument();
  });

  it('renders language selector with correct value', () => {
    renderNavbar();
    expect(screen.getByDisplayValue('EN')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls changeLanguage on language select', () => {
    const changeLanguage = vi.fn();
    mockUseLanguage.mockReturnValue({
      language: 'en',
      changeLanguage,
    });
    renderNavbar();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'es' } });
    expect(changeLanguage).toHaveBeenCalledWith('es');
  });

  it('renders navigation links', () => {
    renderNavbar();
    expect(screen.getByText('navbar.home')).toBeInTheDocument();
    expect(screen.getByText('navbar.products')).toBeInTheDocument();
  });

  it('renders login/register when user is not logged in', () => {
    renderNavbar();
    expect(screen.getByText('navbar.login')).toBeInTheDocument();
    expect(screen.getByText('navbar.register')).toBeInTheDocument();
  });

  it('renders user name and logout when user is logged in', () => {
    mockUseAuth.mockReturnValue({
      user: { name: 'Alice' },
      performLogout: vi.fn(),
    });
    renderNavbar();
    expect(screen.getByText('👋 Alice')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls performLogout when logout button is clicked', () => {
    const performLogout = vi.fn();
    mockUseAuth.mockReturnValue({
      user: { name: 'Bob' },
      performLogout,
    });
    renderNavbar();
    fireEvent.click(screen.getByText('Logout'));
    expect(performLogout).toHaveBeenCalled();
  });

  it('shows cart icon', () => {
    renderNavbar();
    expect(screen.getByTestId('shopping-cart')).toBeInTheDocument();
  });

  it('shows total items badge when cart has items', () => {
    mockUseCart.mockReturnValue({ cart: mockCart });
    renderNavbar();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not show total items badge when cart is empty', () => {
    renderNavbar();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows MiniCart on hover', async () => {
    renderNavbar();
    const cartIcon = screen.getByTestId('shopping-cart').parentElement;
    fireEvent.mouseEnter(cartIcon);
    expect(await screen.findByTestId('minicart')).toBeInTheDocument();
    fireEvent.mouseLeave(cartIcon);
    // MiniCart should disappear after mouse leave
  });
});
