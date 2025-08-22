import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../../pages/Login';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

const fakeUser = {
  username: faker.internet.username(),
  email: faker.internet.email(),
};

// Mock the LoginForm component
vi.mock('../../components/Auth/LoginForm', () => ({
  __esModule: true,
  default: ({ onLoginSuccess }) => (
    <button onClick={() => onLoginSuccess({ username: fakeUser.username })}>
      Mock Login
    </button>
  ),
}));

describe('Login Page', () => {
  it('renders LoginForm', () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: /mock login/i })).toBeInTheDocument();
  });

  it('calls handleLoginSuccess when LoginForm triggers login', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    render(<Login />);
    const button = screen.getByRole('button', { name: /mock login/i });
    await userEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith('User logged in:', { username: fakeUser.username });
    consoleSpy.mockRestore();
  });

  it('handles login with faker user', async () => {
    vi.doMock('../../components/Auth/LoginForm', () => ({
      __esModule: true,
      default: ({ onLoginSuccess }) => (
        <button onClick={() => onLoginSuccess(fakeUser)}>
          Mock Login
        </button>
      ),
    }));

    const LoginWithFaker = (await import('../../pages/Login')).default;
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    render(<LoginWithFaker />);
    const button = screen.getByRole('button', { name: /mock login/i });
    await userEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith('User logged in:', { username: fakeUser.username });
    consoleSpy.mockRestore();
  });
});
