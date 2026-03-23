import { useState, useEffect } from 'react';
import { getReservations, cancelReservation } from '../services/api';

const STATUS_CLASS = {
  CONFIRMED: 'bg-primary/8 text-primary',
  CHECKED_IN: 'bg-secondary/10 text-secondary',
  CHECKED_OUT: 'bg-surface-container text-on-surface-muted',
  CANCELLED: 'bg-tertiary/8 text-tertiary',
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await getReservations();
      setReservations(res.data);
    } catch {
      setError('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await cancelReservation(id);
      load();
    } catch (err) {
      alert(err.response?.data || 'Cancellation failed');
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-8 py-10"><p className="text-on-surface-muted">Loading...</p></div>;

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <h1 className="font-serif text-on-surface tracking-tight mb-8">My Reservations</h1>

      {error && <div className="bg-tertiary/8 text-tertiary px-4 py-3 rounded-lg mb-5">{error}</div>}

      {reservations.length === 0 ? (
        <p className="text-on-surface-muted">No reservations found.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {reservations.map((r) => (
            <div key={r.id} className="bg-surface-lowest rounded-2xl p-6 shadow-ambient">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <strong className="font-serif font-medium text-on-surface">Room {r.roomNumber}</strong>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wide ${STATUS_CLASS[r.status] || 'bg-surface-container text-on-surface-muted'}`}>
                    {r.status}
                  </span>
                </div>
                <span className="font-serif font-semibold text-on-surface">${r.rate.toFixed(2)} total</span>
              </div>
              <div className="text-on-surface-muted text-sm mb-1">{r.checkInDate} → {r.checkOutDate}</div>
              <div className="text-on-surface-muted text-xs mb-4">
                Rate type: {r.rateType}
                {r.cancellationFee > 0 && (
                  <span className="text-tertiary ml-4">Cancellation fee: ${r.cancellationFee.toFixed(2)}</span>
                )}
              </div>
              {r.status === 'CONFIRMED' && (
                <button
                  onClick={() => handleCancel(r.id)}
                  className="px-5 py-2 bg-tertiary/8 text-tertiary border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.06rem] cursor-pointer font-sans"
                >
                  Cancel Reservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
