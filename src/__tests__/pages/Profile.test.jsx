import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) =>
    ({
      'profile.title': 'Profile',
      'profile.name': 'Name',
      'profile.email': 'Email',
      'profile.user_not_logged_in': 'User not logged in',
    }[key] || key),
  }),
}));

describe('Profile page', () => {
  describe('when user is logged in', () => {
    let mockUser;

    beforeEach(async () => {
      mockUser = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      };

      vi.doMock('../../context/auth/useAuth', () => ({
        useAuth: () => ({
          user: mockUser,
        }),
      }));

      vi.resetModules();

      const { default: Profile } = await import('../../pages/Profile');
      render(<Profile />);
    });

    it('renders user info', () => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Name:')).toBeInTheDocument();
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    });
  });

  describe('when user is not logged in', () => {
    beforeEach(async () => {
      vi.resetModules();

      vi.doMock('../../context/auth/useAuth', () => ({
        useAuth: () => ({
          user: null,
        }),
      }));

      const { default: Profile } = await import('../../pages/Profile');
      render(<Profile />);
    });

    it('renders not logged in message', () => {
      expect(screen.getByText('User not logged in')).toBeInTheDocument();
    });
  });
});
