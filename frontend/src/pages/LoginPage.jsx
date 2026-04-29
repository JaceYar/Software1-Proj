import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import StatusMessage from '../components/StatusMessage';

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
    <div className="min-h-screen bg-surface p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-surface-lowest rounded-2xl shadow-ambient overflow-hidden grid lg:grid-cols-5">
        <aside className="lg:col-span-2 bg-primary text-white p-10 flex flex-col justify-end">
          <p className="text-xs uppercase tracking-[0.12rem] opacity-80 mb-4">Guest Access Portal</p>
          <h1 className="font-serif text-4xl leading-tight mb-3">Welcome back to your stay.</h1>
          <p className="text-sm opacity-80">Sign in to manage reservations, complete check-in, and access hotel store services.</p>
        </aside>
        <section className="lg:col-span-3 p-10 md:p-12">
          <h2 className="font-serif text-on-surface text-3xl font-medium tracking-tight m-0">Sign In</h2>
          <p className="text-on-surface-muted text-sm mt-1 mb-8">Use your account credentials to continue.</p>

          <div className="mb-5">
            <StatusMessage type="error" message={error} />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
              Username
              <input
                className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-3 text-on-surface outline-none font-sans text-base placeholder:text-on-surface-muted/50"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
              Password
              <input
                className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-3 text-on-surface outline-none font-sans text-base placeholder:text-on-surface-muted/50"
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </label>
            <button
              className="w-full py-3.5 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.1rem] cursor-pointer mt-2 font-sans"
              type="submit"
            >
              Continue
            </button>
          </form>

          <div className="mt-7 text-sm text-on-surface-muted flex flex-wrap gap-2">
            <span>Need an account?</span>
            <Link to="/register" className="text-primary font-semibold">Create one now</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
