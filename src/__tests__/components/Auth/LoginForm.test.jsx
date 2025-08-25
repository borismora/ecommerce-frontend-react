import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, it, describe, beforeEach } from 'vitest';
import { vi } from 'vitest';
import LoginForm from '../../../components/Auth/LoginForm';
import { useAuth } from '../../../context/auth/useAuth';
import { login } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';

vi.mock('../../../context/auth/useAuth');
vi.mock('../../../services/authService', () => ({
  login: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('LoginForm', () => {
  const mockPerformLogin = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuth.mockReturnValue({ performLogin: mockPerformLogin });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders the login form', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows error message when email or password is empty', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(
      screen.getByText('Email and password are required.')
    ).toBeInTheDocument();
  });

  it('calls performLogin and navigates on successful login', async () => {
    const userCredentials = { email: faker.internet.email(), password: faker.internet.password() };
    const mockUser = { id: 1, name: 'Test User' };
    const mockToken = 'mockToken';
    login.mockResolvedValue({ user: mockUser, token: mockToken });

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: userCredentials.email },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: userCredentials.password },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: userCredentials.email,
        password: userCredentials.password,
      });
      expect(mockPerformLogin).toHaveBeenCalledWith(mockUser);
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
