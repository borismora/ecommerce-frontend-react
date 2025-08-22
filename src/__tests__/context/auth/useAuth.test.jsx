import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../../../context/auth/useAuth';
import { AuthContext } from '../../../context/auth/AuthContext';
import { faker } from '@faker-js/faker';

describe('useAuth', () => {
  it('should return the value from AuthContext', () => {
    const userName = faker.person.fullName();
    const mockAuthValue = { user: { name: userName }, login: vi.fn(), logout: vi.fn() };

    const wrapper = ({ children }) => (
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBe(mockAuthValue);
    expect(result.current.user.name).toBe(userName);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('should return undefined if used outside AuthContext', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current).toBeUndefined();
  });
});
