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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Stay &amp; Shop Hotel</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} placeholder="Username" value={form.username} onChange={set('username')} required />
          <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={set('password')} required />
          <input style={styles.input} placeholder="Full Name" value={form.name} onChange={set('name')} required />
          <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={set('email')} />
          <input style={styles.input} placeholder="Address" value={form.address} onChange={set('address')} />
          <input style={styles.input} placeholder="Credit Card Number" value={form.creditCardNumber} onChange={set('creditCardNumber')} />
          <input style={styles.input} placeholder="Card Expiry (MM/YY)" value={form.creditCardExpiry} onChange={set('creditCardExpiry')} />
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#fbf9f4', padding: '2rem',
  },
  card: {
    background: '#ffffff', padding: '3rem', borderRadius: '1.25rem',
    boxShadow: '0 20px 40px rgba(27, 28, 25, 0.06)', width: '100%', maxWidth: '440px',
  },
  title: {
    margin: 0, fontSize: '2rem', color: '#1b1c19',
    fontFamily: "'Noto Serif', Georgia, serif", fontWeight: '500', letterSpacing: '-0.02em',
  },
  subtitle: { color: '#737873', marginBottom: '2rem', marginTop: '0.25rem', fontSize: '0.9rem' },
  error: {
    background: 'rgba(75, 12, 15, 0.06)', color: '#4b0c0f', padding: '0.75rem 1rem',
    borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.875rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  input: {
    padding: '0.75rem 0', border: 'none', borderBottom: '1px solid #737873',
    background: 'transparent', fontSize: '1rem', outline: 'none', width: '100%',
    color: '#1b1c19', fontFamily: "'Manrope', system-ui, sans-serif",
  },
  button: {
    padding: '0.875rem', background: 'linear-gradient(135deg, #18281e, #2d3e33)',
    color: '#ffffff', border: 'none', borderRadius: '0.75rem', fontSize: '0.75rem',
    fontWeight: '600', letterSpacing: '0.1rem', textTransform: 'uppercase', cursor: 'pointer',
    marginTop: '0.5rem', fontFamily: "'Manrope', system-ui, sans-serif",
  },
  footer: { marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#737873' },
};
