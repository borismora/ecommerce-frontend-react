import { render, screen, act } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { AuthProvider } from '../../../context/auth/AuthProvider';
import { AuthContext } from '../../../context/auth/AuthContext';
import { describe, it, expect, beforeEach } from 'vitest';

function renderWithProvider(children) {
  return render(<AuthProvider>{children}</AuthProvider>);
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide null user by default if no user in localStorage', () => {
    let contextValue;
    renderWithProvider(
      <AuthContext.Consumer>
        {value => {
          contextValue = value;
          return null;
        }}
      </AuthContext.Consumer>
    );
    expect(contextValue.user).toBeNull();
  });

  it('should initialize user from localStorage if present', () => {
    const fakeUser = { name: faker.person.fullName() };
    localStorage.setItem('user', JSON.stringify(fakeUser));
    let contextValue;
    renderWithProvider(
      <AuthContext.Consumer>
        {value => {
          contextValue = value;
          return null;
        }}
      </AuthContext.Consumer>
    );
    expect(contextValue.user).toEqual(fakeUser);
  });

  it('should update user and localStorage on performLogin', () => {
    let contextValue;
    renderWithProvider(
      <AuthContext.Consumer>
        {value => {
          contextValue = value;
          return null;
        }}
      </AuthContext.Consumer>
    );
    const fakeUser = { name: faker.person.fullName() };
    act(() => {
      contextValue.performLogin(fakeUser);
    });
    expect(contextValue.user).toEqual(fakeUser);
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(fakeUser);
  });

  it('should clear user and localStorage on performLogout', () => {
    const fakeUser = { name: faker.person.fullName() };
    localStorage.setItem('user', JSON.stringify(fakeUser));
    let contextValue;
    renderWithProvider(
      <AuthContext.Consumer>
        {value => {
          contextValue = value;
          return null;
        }}
      </AuthContext.Consumer>
    );
    act(() => {
      contextValue.performLogout();
    });
    expect(contextValue.user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should provide performLogin and performLogout functions', () => {
    let contextValue;
    renderWithProvider(
      <AuthContext.Consumer>
        {value => {
          contextValue = value;
          return null;
        }}
      </AuthContext.Consumer>
    );
    expect(typeof contextValue.performLogin).toBe('function');
    expect(typeof contextValue.performLogout).toBe('function');
  });

  it('should render children', () => {
    renderWithProvider(<div data-testid="child" />);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
