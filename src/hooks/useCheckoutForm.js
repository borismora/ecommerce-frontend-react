import { useState } from 'react';

export function useCheckoutForm(initial = { name: '', email: '', address: '' }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const validate = () => {
    if (!form.name || !form.email || !form.address) {
      setError('Please fill in all fields');
      return false;
    }

    setError('');
    return true;
  }

  return { form, setForm, error, setError, handleChange, validate };
}
