import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import StatusMessage from '../components/StatusMessage';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', name: '', email: '',
    address: '', creditCardNumber: '', creditCardExpiry: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password || form.password.length < 8) next.password = 'Password must be at least 8 characters.';

    const cardDigits = form.creditCardNumber.replace(/\D/g, '');
    if (!/^\d{13,19}$/.test(cardDigits)) next.creditCardNumber = 'Enter a valid credit card number.';

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.creditCardExpiry)) next.creditCardExpiry = 'Use MM/YY format.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const nextErrors = validate();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    try {
      await register(form);
      navigate('/rooms');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  const inputClass = "w-full border-0 border-b border-outline bg-transparent pb-3 text-on-surface outline-none font-sans text-base placeholder:text-on-surface-muted/50 mt-2";
  const errorClass = "text-xs text-tertiary mt-1";

  return (
    <div className="min-h-screen bg-surface p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-surface-lowest rounded-2xl shadow-ambient overflow-hidden grid lg:grid-cols-5">
        <aside className="lg:col-span-2 bg-secondary text-white p-10 flex flex-col justify-end">
          <p className="text-xs uppercase tracking-[0.12rem] opacity-80 mb-4">Guest Registration</p>
          <h1 className="font-serif text-4xl leading-tight mb-3">Create your stay profile.</h1>
          <p className="text-sm opacity-85">Register once to book faster, manage reservations, and use in-hotel services without repeated checkout details.</p>
        </aside>
        <section className="lg:col-span-3 p-10 md:p-12">
          <h2 className="font-serif text-on-surface text-3xl font-medium tracking-tight m-0">Create Account</h2>
          <p className="text-on-surface-muted text-sm mt-1 mb-8">Complete all sections to activate your guest account.</p>

          <div className="mb-5">
            <StatusMessage type="error" message={error} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted mb-3">Identity</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                  Username
                  <input className={inputClass} placeholder="Choose username" value={form.username} onChange={set('username')} required />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                  Full Name
                  <input className={inputClass} placeholder="Guest full name" value={form.name} onChange={set('name')} required />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted md:col-span-2">
                  Password
                  <input className={inputClass} type="password" placeholder="Minimum 8 characters" value={form.password} onChange={set('password')} required />
                  {fieldErrors.password && <p className={errorClass}>{fieldErrors.password}</p>}
                </label>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted mb-3">Contact</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                  Email
                  <input className={inputClass} type="email" placeholder="name@example.com" value={form.email} onChange={set('email')} required />
                  {fieldErrors.email && <p className={errorClass}>{fieldErrors.email}</p>}
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                  Address
                  <input className={inputClass} placeholder="Street, city, state" value={form.address} onChange={set('address')} required />
                </label>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted mb-3">Payment</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                  Credit Card Number
                  <input className={inputClass} placeholder="•••• •••• •••• ••••" value={form.creditCardNumber} onChange={set('creditCardNumber')} required />
                  {fieldErrors.creditCardNumber && <p className={errorClass}>{fieldErrors.creditCardNumber}</p>}
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                  Card Expiry (MM/YY)
                  <input className={inputClass} placeholder="MM/YY" value={form.creditCardExpiry} onChange={set('creditCardExpiry')} required />
                  {fieldErrors.creditCardExpiry && <p className={errorClass}>{fieldErrors.creditCardExpiry}</p>}
                </label>
              </div>
            </section>

            <button
              className="w-full py-3.5 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.1rem] cursor-pointer font-sans"
              type="submit"
            >
              Create Account
            </button>
          </form>

          <div className="mt-7 text-sm text-on-surface-muted flex flex-wrap gap-2">
            <span>Already registered?</span>
            <Link to="/login" className="text-primary font-semibold">Sign in instead</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
