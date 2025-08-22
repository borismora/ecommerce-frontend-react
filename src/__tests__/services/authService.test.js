import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from '../../services/authService';
import { faker } from '@faker-js/faker';

describe('authService', () => {
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;
  const fakeUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call login API with correct credentials', async () => {
    const mockResponse = {
      token: faker.string.uuid(),
      user: { id: faker.string.uuid(), email: fakeUser.email }
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await authService.login({ email: fakeUser.email, password: fakeUser.password });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`${API_URL}/login`),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: fakeUser.email, password: fakeUser.password }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should throw error if login fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    });

    await expect(authService.login(fakeUser.email, fakeUser.password)).rejects.toThrow();
  });

  it('should call register API with correct data', async () => {
    const fakeRegisterData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
    };
    const mockResponse = { id: faker.string.uuid(), ...fakeRegisterData };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await authService.register(fakeRegisterData);

    const fetchCallArgs = globalThis.fetch.mock.calls[0];
    const requestBody = JSON.parse(fetchCallArgs[1].body);

    expect(fetchCallArgs[0]).toContain(`${API_URL}/register`);
    expect(fetchCallArgs[1].method).toBe('POST');
    expect(requestBody).toEqual(fakeRegisterData);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error if register fails', async () => {
    const fakeRegisterData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad Request' }),
    });

    await expect(authService.register(fakeRegisterData)).rejects.toThrow();
  });
});
