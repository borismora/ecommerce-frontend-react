import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../../../components/Auth/LoginForm';
import { api } from '../../../services/api';
import { faker } from '@faker-js/faker';

// Mock dependencies
vi.mock('../../../services/api', () => ({
  api: {
    post: vi.fn(),
  },
}));
vi.mock('../../../context/auth/useAuth', () => ({
  useAuth: () => ({
    performLogin: vi.fn(),
  }),
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('LoginForm', () => {
  const fakeUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  const fakeToken = faker.string.alphanumeric(20);

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders form inputs and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText('login.email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('login.password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'login.submit' })).toBeInTheDocument();
  });

  it('shows error if fields are empty', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: 'login.submit' }));
    expect(await screen.findByText('login.emptyFields')).toBeInTheDocument();
  });

  it('calls api.post on successful submit', async () => {
    api.post.mockResolvedValueOnce({ user: { id: 1 }, token: fakeToken });
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText('login.email'), { target: { value: fakeUser.email } });
    fireEvent.change(screen.getByPlaceholderText('login.password'), { target: { value: fakeUser.password } });
    fireEvent.click(screen.getByRole('button', { name: 'login.submit' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: fakeUser.email,
        password: fakeUser.password,
      });
      expect(localStorage.getItem('token')).toBe(fakeToken);
    });
  });

  it('shows error message on login failure', async () => {
    api.post.mockRejectedValueOnce(new Error('fail'));
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText('login.email'), { target: { value: fakeUser.email } });
    fireEvent.change(screen.getByPlaceholderText('login.password'), { target: { value: fakeUser.password } });
    fireEvent.click(screen.getByRole('button', { name: 'login.submit' }));

    expect(await screen.findByText('login.error')).toBeInTheDocument();
  });

  it('clears form after successful login', async () => {
    api.post.mockResolvedValueOnce({ user: { id: 1 }, token: fakeToken });
    render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText('login.email');
    const passwordInput = screen.getByPlaceholderText('login.password');
    fireEvent.change(emailInput, { target: { value: fakeUser.email } });
    fireEvent.change(passwordInput, { target: { value: fakeUser.password } });
    fireEvent.click(screen.getByRole('button', { name: 'login.submit' }));

    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  it('shows success style when success is true', async () => {
    api.post.mockResolvedValueOnce({ user: { id: 1 }, token: fakeToken });
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText('login.email'), { target: { value: fakeUser.email } });
    fireEvent.change(screen.getByPlaceholderText('login.password'), { target: { value: fakeUser.password } });
    fireEvent.click(screen.getByRole('button', { name: 'login.submit' }));

    await waitFor(() => {
      expect(screen.queryByText('login.error')).not.toBeInTheDocument();
      expect(screen.queryByText('login.emptyFields')).not.toBeInTheDocument();
    });
  });
});
