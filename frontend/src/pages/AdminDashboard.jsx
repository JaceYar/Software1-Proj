import { useState, useEffect } from 'react';
import { getUsers, createClerk, resetPassword } from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newClerk, setNewClerk] = useState({ username: '', name: '' });
  const [resetForm, setResetForm] = useState({ username: '', newPassword: '' });

  const load = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch {
      setError('Failed to load users');
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreateClerk = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await createClerk(newClerk);
      setSuccess(`Clerk created. Default password: ${res.data.defaultPassword}`);
      setNewClerk({ username: '', name: '' });
      load();
    } catch (err) {
      setError(err.response?.data || 'Failed to create clerk');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await resetPassword(resetForm);
      setSuccess('Password reset successfully');
      setResetForm({ username: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data || 'Failed to reset password');
    }
  };

  const ROLE_COLORS = {
    ADMIN: { bg: 'rgba(75,12,15,0.08)', color: '#4b0c0f' },
    CLERK: { bg: 'rgba(113,90,62,0.1)', color: '#715a3e' },
    GUEST: { bg: 'rgba(24,40,30,0.08)', color: '#18281e' },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Admin Dashboard</h1>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.grid}>
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Create Clerk Account</h2>
          <form onSubmit={handleCreateClerk} style={styles.form}>
            <input style={styles.input} placeholder="Username" value={newClerk.username}
              onChange={(e) => setNewClerk({ ...newClerk, username: e.target.value })} required />
            <input style={styles.input} placeholder="Full Name" value={newClerk.name}
              onChange={(e) => setNewClerk({ ...newClerk, name: e.target.value })} />
            <button type="submit" style={styles.btn}>Create Clerk</button>
          </form>
        </div>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Reset Password</h2>
          <form onSubmit={handleResetPassword} style={styles.form}>
            <input style={styles.input} placeholder="Username" value={resetForm.username}
              onChange={(e) => setResetForm({ ...resetForm, username: e.target.value })} required />
            <input style={styles.input} type="password" placeholder="New Password" value={resetForm.newPassword}
              onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })} required />
            <button type="submit" style={styles.btn}>Reset Password</button>
          </form>
        </div>
      </div>

      <h2 style={{ ...styles.panelTitle, marginTop: '2rem' }}>All Users ({users.length})</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            {['ID', 'Username', 'Name', 'Email', 'Role'].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={styles.td}>{u.id}</td>
              <td style={styles.td}>{u.username}</td>
              <td style={styles.td}>{u.name}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>
                <span style={{ background: (ROLE_COLORS[u.role] || {}).bg, color: (ROLE_COLORS[u.role] || {}).color, padding: '0.2rem 0.6rem', borderRadius: '0.375rem', fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.04rem' }}>
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 2rem' },
  heading: {
    color: '#1b1c19', marginBottom: '2rem',
    fontFamily: "'Noto Serif', Georgia, serif", letterSpacing: '-0.02em',
  },
  error: {
    background: 'rgba(75,12,15,0.06)', color: '#4b0c0f',
    padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem',
  },
  success: {
    background: 'rgba(24,40,30,0.06)', color: '#18281e',
    padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' },
  panel: {
    background: '#ffffff', borderRadius: '1rem', padding: '2rem',
    boxShadow: '0 20px 40px rgba(27, 28, 25, 0.06)',
  },
  panelTitle: {
    color: '#1b1c19', marginBottom: '1.25rem',
    fontFamily: "'Noto Serif', Georgia, serif", fontSize: '1.1rem', fontWeight: '500',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  input: {
    padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #737873',
    background: 'transparent', fontSize: '0.9rem', outline: 'none',
    color: '#1b1c19', fontFamily: "'Manrope', system-ui, sans-serif",
  },
  btn: {
    padding: '0.75rem', background: 'linear-gradient(135deg, #18281e, #2d3e33)', color: '#ffffff',
    border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
    fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.08rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
  table: {
    width: '100%', borderCollapse: 'collapse', background: '#ffffff',
    borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(27, 28, 25, 0.06)',
  },
  th: {
    background: '#18281e', color: '#ffffff', padding: '1rem 1.25rem',
    textAlign: 'left', fontSize: '0.65rem', fontWeight: '600',
    letterSpacing: '0.08rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
  td: {
    padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: '#1b1c19',
    borderBottom: '1px solid #f5f3ee',
  },
};
