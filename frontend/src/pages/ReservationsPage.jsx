import { useState, useEffect } from 'react';
import { getReservations, cancelReservation } from '../services/api';

const STATUS_COLORS = {
  CONFIRMED: '#d4edda', CHECKED_IN: '#cce5ff',
  CHECKED_OUT: '#e2e3e5', CANCELLED: '#f8d7da',
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

  if (loading) return <div style={styles.page}><p>Loading...</p></div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Reservations</h1>
      {error && <div style={styles.error}>{error}</div>}
      {reservations.length === 0 ? (
        <p style={{ color: '#888' }}>No reservations found.</p>
      ) : (
        <div style={styles.list}>
          {reservations.map((r) => (
            <div key={r.id} style={{ ...styles.card, borderLeft: `4px solid ${STATUS_COLORS[r.status] || '#ddd'}` }}>
              <div style={styles.cardTop}>
                <div>
                  <strong>Room {r.roomNumber}</strong>
                  <span style={{ ...styles.statusBadge, background: STATUS_COLORS[r.status] }}>
                    {r.status}
                  </span>
                </div>
                <span style={styles.total}>${r.rate.toFixed(2)} total</span>
              </div>
              <div style={styles.dates}>
                {r.checkInDate} → {r.checkOutDate}
              </div>
              <div style={styles.meta}>
                Rate type: {r.rateType}
                {r.cancellationFee > 0 && (
                  <span style={{ color: '#c00', marginLeft: '1rem' }}>
                    Cancellation fee: ${r.cancellationFee.toFixed(2)}
                  </span>
                )}
              </div>
              {r.status === 'CONFIRMED' && (
                <button onClick={() => handleCancel(r.id)} style={styles.cancelBtn}>
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

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  heading: { color: '#1a1a2e', marginBottom: '1.5rem' },
  error: { background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    background: '#fff', borderRadius: '8px', padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  statusBadge: {
    marginLeft: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '3px',
    fontSize: '0.75rem', fontWeight: 'bold',
  },
  total: { fontWeight: 'bold', color: '#1a1a2e' },
  dates: { color: '#555', fontSize: '0.9rem', marginBottom: '0.25rem' },
  meta: { color: '#888', fontSize: '0.8rem', marginBottom: '0.75rem' },
  cancelBtn: {
    padding: '0.35rem 0.9rem', background: '#dc3545', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem',
  },
};
