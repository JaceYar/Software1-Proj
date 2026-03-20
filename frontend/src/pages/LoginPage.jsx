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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Stay &amp; Shop Hotel</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={styles.footer}>
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f5f5f5',
  },
  card: {
    background: '#fff', padding: '2.5rem', borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px',
  },
  title: { margin: 0, fontSize: '1.75rem', color: '#1a1a2e' },
  subtitle: { color: '#888', marginBottom: '1.5rem' },
  error: {
    background: '#fee', color: '#c00', padding: '0.5rem', borderRadius: '4px',
    marginBottom: '1rem', fontSize: '0.875rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: {
    padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px',
    fontSize: '1rem', outline: 'none',
  },
  button: {
    padding: '0.75rem', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer',
    marginTop: '0.5rem',
  },
  footer: { marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' },
};
