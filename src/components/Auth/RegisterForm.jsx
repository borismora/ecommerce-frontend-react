import { useState } from 'react';
import { register } from '../../services/authService';
import { useAuth } from '../../context/auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const { performLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setMessage('All fields are required.');
      setSuccess(false);
      return;
    }

    try {
      const response = await register(form);
      localStorage.setItem('token', response.token);
      performLogin(response.user);

      setSuccess(true);
      setMessage('✅ Registration successful! Redirecting...');
      setForm({ name: '', email: '', password: '' });

      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch {
      setMessage('❌ Registration failed. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">Create Account</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

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
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
        >
          Register
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
