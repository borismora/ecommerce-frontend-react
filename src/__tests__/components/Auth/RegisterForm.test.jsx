/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, it, jest, describe, beforeEach } from '@jest/globals';
import RegisterForm from '../../../components/Auth/RegisterForm';
import { useAuth } from '../../../context/auth/useAuth';
import { register } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';

jest.mock('../../../context/auth/useAuth');
jest.mock('../../../services/authService', () => ({
  register: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('RegisterForm', () => {
  const mockPerformLogin = jest.fn();
  const mockNavigate = jest.fn();
  const mockUser = { id: 1, name: 'Test User' };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    useAuth.mockReturnValue({ performLogin: mockPerformLogin });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders the registration form', () => {
    render(<RegisterForm />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows error message when name, email or password is empty', () => {
    render(<RegisterForm />);
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(
      screen.getByText('All fields are required.')
    ).toBeInTheDocument();
  });

  it('calls performLogin and navigates on successful registration', async () => {
    const userCredentials = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const mockToken = 'mockToken';
    register.mockResolvedValue({ user: mockUser, token: mockToken });

    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: userCredentials.name },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: userCredentials.email },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: userCredentials.password },
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: userCredentials.name,
        email: userCredentials.email,
        password: userCredentials.password,
      });
      expect(mockPerformLogin).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    expect(localStorage.getItem('token')).toBe(mockToken);
  });
});
