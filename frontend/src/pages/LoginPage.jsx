import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.username, form.password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'CLERK') navigate('/clerk');
      else navigate('/rooms');
    } catch (err) {
      setError(err.response?.data || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-8">
      <div className="bg-surface-lowest p-12 rounded-2xl shadow-ambient w-full max-w-md">
        <h2 className="font-serif text-on-surface text-3xl font-medium tracking-tight m-0">Welcome Back</h2>
        <p className="text-on-surface-muted text-sm mt-1 mb-8">Stay &amp; Shop Hotel</p>

        {error && (
          <div className="bg-tertiary/8 text-tertiary px-4 py-3 rounded-lg text-sm mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            className="w-full border-0 border-b border-outline bg-transparent pb-3 text-on-surface outline-none font-sans text-base placeholder:text-on-surface-muted/50"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            className="w-full border-0 border-b border-outline bg-transparent pb-3 text-on-surface outline-none font-sans text-base placeholder:text-on-surface-muted/50"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            className="w-full py-3.5 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.1rem] cursor-pointer mt-2 font-sans"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-muted">
          No account? <Link to="/register" className="text-primary">Register here</Link>
        </p>
      </div>
    </div>
  );
}
