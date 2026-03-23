import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', name: '', email: '',
    address: '', creditCardNumber: '', creditCardExpiry: '',
  });
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/rooms');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  const inputClass = "w-full border-0 border-b border-outline bg-transparent pb-3 text-on-surface outline-none font-sans text-base placeholder:text-on-surface-muted/50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-8">
      <div className="bg-surface-lowest p-12 rounded-2xl shadow-ambient w-full max-w-md">
        <h2 className="font-serif text-on-surface text-3xl font-medium tracking-tight m-0">Create Account</h2>
        <p className="text-on-surface-muted text-sm mt-1 mb-8">Stay &amp; Shop Hotel</p>

        {error && (
          <div className="bg-tertiary/8 text-tertiary px-4 py-3 rounded-lg text-sm mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input className={inputClass} placeholder="Username" value={form.username} onChange={set('username')} required />
          <input className={inputClass} type="password" placeholder="Password" value={form.password} onChange={set('password')} required />
          <input className={inputClass} placeholder="Full Name" value={form.name} onChange={set('name')} required />
          <input className={inputClass} type="email" placeholder="Email" value={form.email} onChange={set('email')} />
          <input className={inputClass} placeholder="Address" value={form.address} onChange={set('address')} />
          <input className={inputClass} placeholder="Credit Card Number" value={form.creditCardNumber} onChange={set('creditCardNumber')} />
          <input className={inputClass} placeholder="Card Expiry (MM/YY)" value={form.creditCardExpiry} onChange={set('creditCardExpiry')} />
          <button
            className="w-full py-3.5 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.1rem] cursor-pointer mt-2 font-sans"
            type="submit"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-muted">
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
}
