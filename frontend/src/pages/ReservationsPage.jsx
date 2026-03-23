import { useState, useEffect } from 'react';
import { getReservations, cancelReservation } from '../services/api';

const STATUS_COLORS = {
  CONFIRMED: { bg: 'rgba(24,40,30,0.08)', color: '#18281e' },
  CHECKED_IN: { bg: 'rgba(113,90,62,0.1)', color: '#715a3e' },
  CHECKED_OUT: { bg: '#f0eee9', color: '#737873' },
  CANCELLED: { bg: 'rgba(75,12,15,0.08)', color: '#4b0c0f' },
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
            <div key={r.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <strong style={{ fontFamily: "'Noto Serif', Georgia, serif", fontWeight: '500' }}>Room {r.roomNumber}</strong>
                  <span style={{ ...styles.statusBadge, background: (STATUS_COLORS[r.status] || {}).bg, color: (STATUS_COLORS[r.status] || {}).color }}>
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
  page: { maxWidth: '800px', margin: '0 auto', padding: '2.5rem 2rem' },
  heading: {
    color: '#1b1c19', marginBottom: '2rem',
    fontFamily: "'Noto Serif', Georgia, serif", letterSpacing: '-0.02em',
  },
  error: {
    background: 'rgba(75,12,15,0.06)', color: '#4b0c0f',
    padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  card: {
    background: '#ffffff', borderRadius: '1rem', padding: '1.5rem',
    boxShadow: '0 20px 40px rgba(27, 28, 25, 0.06)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  statusBadge: {
    padding: '0.2rem 0.6rem', borderRadius: '0.375rem',
    fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.04rem',
  },
  total: { fontWeight: '600', color: '#1b1c19', fontFamily: "'Noto Serif', Georgia, serif" },
  dates: { color: '#737873', fontSize: '0.9rem', marginBottom: '0.25rem' },
  meta: { color: '#737873', fontSize: '0.8rem', marginBottom: '1rem' },
  cancelBtn: {
    padding: '0.5rem 1.25rem', background: 'rgba(75,12,15,0.08)', color: '#4b0c0f',
    border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.7rem',
    fontWeight: '600', letterSpacing: '0.06rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
};
