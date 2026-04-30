import { useState } from 'react';
import { createPortal } from 'react-dom';
import { changePassword } from '../services/api';
import StatusMessage from './StatusMessage';

export default function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data || 'Failed to change password.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none';

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-surface-lowest rounded-2xl p-6 max-w-md w-full shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-on-surface text-xl">Change Password</h3>
          <button type="button" onClick={onClose} className="text-on-surface-muted text-sm">Close</button>
        </div>
        <div className="space-y-3 mb-4">
          <StatusMessage type="error" message={error} />
          <StatusMessage type="success" message={success} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted block">
            Current Password
            <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={inputClass} />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted block">
            New Password
            <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted block">
            Confirm New Password
            <input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-linear-to-br from-primary to-primary-container text-white rounded-xl text-xs font-semibold uppercase tracking-[0.1rem] disabled:opacity-50"
          >
            {submitting ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
