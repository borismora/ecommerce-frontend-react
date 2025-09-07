import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../../../components/Auth/RegisterForm';
import { register } from '../../../services/authService';
import { faker } from '@faker-js/faker';

// Mocks
vi.mock('../../../services/authService', () => ({
  register: vi.fn(),
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

describe('RegisterForm', () => {
  const fakeUser = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders form fields and submit button', () => {
    render(<RegisterForm />);
    expect(screen.getByPlaceholderText('register.name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('register.email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('register.password')).toBeInTheDocument();
    expect(screen.getByText('register.submit')).toBeInTheDocument();
  });

  it('shows error if fields are empty on submit', async () => {
    render(<RegisterForm />);
    fireEvent.click(screen.getByText('register.submit'));
    expect(await screen.findByText('register.emptyFields')).toBeInTheDocument();
  });

  it('calls register and shows success on valid submit', async () => {
    register.mockResolvedValueOnce({
      token: 'fake-token',
      user: { name: fakeUser.name, email: fakeUser.email },
    });
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('register.name'), { target: { value: fakeUser.name } });
    fireEvent.change(screen.getByPlaceholderText('register.email'), { target: { value: fakeUser.email } });
    fireEvent.change(screen.getByPlaceholderText('register.password'), { target: { value: fakeUser.password } });
    fireEvent.click(screen.getByText('register.submit'));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith(fakeUser);
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(screen.getByText('register.success')).toBeInTheDocument();
    });
  });

  it('shows error message if register throws', async () => {
    register.mockRejectedValueOnce(new Error('fail'));
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('register.name'), { target: { value: fakeUser.name } });
    fireEvent.change(screen.getByPlaceholderText('register.email'), { target: { value: fakeUser.email } });
    fireEvent.change(screen.getByPlaceholderText('register.password'), { target: { value: fakeUser.password } });
    fireEvent.click(screen.getByText('register.submit'));

    expect(await screen.findByText('register.error')).toBeInTheDocument();
  });

  it('clears form after successful registration', async () => {
    register.mockResolvedValueOnce({
      token: 'fake-token',
      user: { name: fakeUser.name, email: fakeUser.email },
    });
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('register.name'), { target: { value: fakeUser.name } });
    fireEvent.change(screen.getByPlaceholderText('register.email'), { target: { value: fakeUser.email } });
    fireEvent.change(screen.getByPlaceholderText('register.password'), { target: { value: fakeUser.password } });
    fireEvent.click(screen.getByText('register.submit'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('register.name').value).toBe('');
      expect(screen.getByPlaceholderText('register.email').value).toBe('');
      expect(screen.getByPlaceholderText('register.password').value).toBe('');
    });
  });
});
