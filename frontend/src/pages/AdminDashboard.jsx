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

  const ROLE_COLORS = { ADMIN: '#f8d7da', CLERK: '#cce5ff', GUEST: '#d4edda' };

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
                <span style={{ background: ROLE_COLORS[u.role], padding: '0.1rem 0.5rem', borderRadius: '3px', fontSize: '0.75rem' }}>
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
  page: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  heading: { color: '#1a1a2e', marginBottom: '1.5rem' },
  error: { background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  success: { background: '#efe', color: '#060', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  panel: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  panelTitle: { color: '#1a1a2e', fontSize: '1.1rem', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: { padding: '0.625rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' },
  btn: { padding: '0.625rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  th: { background: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem' },
  td: { padding: '0.625rem 1rem', borderBottom: '1px solid #eee', fontSize: '0.875rem' },
};
