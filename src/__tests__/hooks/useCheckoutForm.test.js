import { renderHook, act } from '@testing-library/react';
import { useCheckoutForm } from '../../hooks/useCheckoutForm';
import { faker } from '@faker-js/faker';
import { expect, describe, it } from 'vitest';

describe('useCheckoutForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCheckoutForm());
    expect(result.current.form).toEqual({ name: '', email: '', address: '' });
    expect(result.current.error).toBe('');
  });

  it('should initialize with custom initial values', () => {
    const initial = { name: 'John', email: 'john@example.com', address: '123 St' };
    const { result } = renderHook(() => useCheckoutForm(initial));
    expect(result.current.form).toEqual(initial);
  });

  it('should update form values on handleChange', () => {
    const { result } = renderHook(() => useCheckoutForm());
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'Alice' } });
    });
    expect(result.current.form.name).toBe('Alice');
  });

  it('should set error if fields are missing on validate', () => {
    const { result } = renderHook(() => useCheckoutForm());
    act(() => {
      result.current.setForm({ name: '', email: '', address: '' });
    });
    let valid;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid).toBe(false);
    expect(result.current.error).toBe('Please fill in all fields');
  });

  it('should clear error and return true if all fields are filled', () => {
    const { result } = renderHook(() => useCheckoutForm());
    act(() => {
      result.current.setForm({ name: 'A', email: 'a@a.com', address: 'Addr' });
    });
    let valid;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid).toBe(true);
    expect(result.current.error).toBe('');
  });

  it('should work with faker data', () => {
    const fakeData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
    };
    const { result } = renderHook(() => useCheckoutForm());
    act(() => {
      result.current.setForm(fakeData);
    });
    let valid;
    act(() => {
      valid = result.current.validate();
    });
    expect(result.current.form).toEqual(fakeData);
    expect(valid).toBe(true);
    expect(result.current.error).toBe('');
  });
});
