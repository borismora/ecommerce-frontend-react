import { describe, it, expect } from 'vitest';
import { AuthContext } from '../../../context/auth/AuthContext';
import { render } from '@testing-library/react';
import { faker } from '@faker-js/faker';

describe('AuthContext', () => {
  it('should be defined', () => {
    expect(AuthContext).toBeDefined();
  });

  it('should have a Provider and Consumer', () => {
    expect(AuthContext.Provider).toBeDefined();
    expect(AuthContext.Consumer).toBeDefined();
  });

  it('should provide value to children', () => {
    const userName = faker.person.fullName()
    const fakeValue = { user: { id: faker.person.id, name: userName }, isAuthenticated: true };
    const Child = () => (
      <AuthContext.Consumer>
        {value => (
          <span data-testid="user">{value.user.name}</span>
        )}
      </AuthContext.Consumer>
    );
    const { getByTestId } = render(
      <AuthContext.Provider value={fakeValue}>
        <Child />
      </AuthContext.Provider>
    );
    expect(getByTestId('user').textContent).toBe(userName);
  });
});
