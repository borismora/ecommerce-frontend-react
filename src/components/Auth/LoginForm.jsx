import { useState } from 'react';
import { login } from '../../services/authService';
import { useAuth } from '../../context/auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const { performLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setMessage('Email and password are required.');
      setSuccess(false);
      return;
    }

    try {
      const response = await login(form);
      performLogin(response.user);
      localStorage.setItem('token', response.token);
      setSuccess(true);
      setForm({ email: '', password: '' });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ Login failed. Please check your credentials.');
      setSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">Login</h2>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>

        {message && (
          <p className={`mt-4 text-sm text-center ${success ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
