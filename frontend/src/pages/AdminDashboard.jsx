import { useState, useEffect } from 'react';
import { getUsers, createClerk, resetPassword } from '../services/api';

const ROLE_CLASS = {
  ADMIN: 'bg-tertiary/8 text-tertiary',
  CLERK: 'bg-secondary/10 text-secondary',
  GUEST: 'bg-primary/8 text-primary',
};

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

  const inputClass = "w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none font-sans text-sm";

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <h1 className="font-serif text-on-surface tracking-tight mb-8">Admin Dashboard</h1>

      {error && <div className="bg-tertiary/8 text-tertiary px-4 py-3 rounded-lg mb-5">{error}</div>}
      {success && <div className="bg-primary/8 text-primary px-4 py-3 rounded-lg mb-5">{success}</div>}

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-surface-lowest rounded-2xl p-8 shadow-ambient">
          <h2 className="font-serif text-on-surface text-xl font-medium mb-5">Create Clerk Account</h2>
          <form onSubmit={handleCreateClerk} className="flex flex-col gap-5">
            <input
              className={inputClass}
              placeholder="Username"
              value={newClerk.username}
              onChange={(e) => setNewClerk({ ...newClerk, username: e.target.value })}
              required
            />
            <input
              className={inputClass}
              placeholder="Full Name"
              value={newClerk.name}
              onChange={(e) => setNewClerk({ ...newClerk, name: e.target.value })}
            />
            <button
              type="submit"
              className="py-3 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.08rem] cursor-pointer font-sans"
            >
              Create Clerk
            </button>
          </form>
        </div>

        <div className="bg-surface-lowest rounded-2xl p-8 shadow-ambient">
          <h2 className="font-serif text-on-surface text-xl font-medium mb-5">Reset Password</h2>
          <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
            <input
              className={inputClass}
              placeholder="Username"
              value={resetForm.username}
              onChange={(e) => setResetForm({ ...resetForm, username: e.target.value })}
              required
            />
            <input
              className={inputClass}
              type="password"
              placeholder="New Password"
              value={resetForm.newPassword}
              onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
              required
            />
            <button
              type="submit"
              className="py-3 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.08rem] cursor-pointer font-sans"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>

      <h2 className="font-serif text-on-surface text-xl font-medium mb-5">All Users ({users.length})</h2>
      <div className="bg-surface-lowest rounded-2xl shadow-ambient overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['ID', 'Username', 'Name', 'Email', 'Role'].map((h) => (
                <th key={h} className="bg-primary text-white px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.08rem] font-sans">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className={i % 2 === 0 ? 'bg-surface-lowest' : 'bg-surface-low'}>
                <td className="px-5 py-3.5 text-sm text-on-surface">{u.id}</td>
                <td className="px-5 py-3.5 text-sm text-on-surface">{u.username}</td>
                <td className="px-5 py-3.5 text-sm text-on-surface">{u.name}</td>
                <td className="px-5 py-3.5 text-sm text-on-surface-muted">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wide ${ROLE_CLASS[u.role] || 'bg-surface-container text-on-surface-muted'}`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
