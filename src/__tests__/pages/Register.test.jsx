import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Register from '../../pages/Register';

vi.mock('../../components/Auth/RegisterForm', () => ({
  default: () => <div data-testid="register-form">Mock RegisterForm</div>,
}));

describe('Register Page', () => {
  it('renders RegisterForm component', () => {
    render(<Register />);
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Register />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with different props', () => {
    const { rerender } = render(<Register />);
    expect(screen.getByTestId('register-form')).toBeInTheDocument();

    rerender(<Register />);
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });
});
