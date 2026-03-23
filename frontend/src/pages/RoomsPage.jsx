import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableRooms, createReservation } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FLOOR_NAMES = { 1: 'Nature Retreat', 2: 'Urban Elegance', 3: 'Vintage Charm' };

export default function RoomsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const search = async () => {
    if (!checkIn || !checkOut) return;
    setLoading(true);
    setError('');
    try {
      const res = await getAvailableRooms(checkIn, checkOut);
      setRooms(res.data);
      setSearched(true);
    } catch {
      setError('Failed to search rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (room) => {
    if (!user) { navigate('/login'); return; }
    setError('');
    setSuccess('');
    try {
      await createReservation({ roomId: room.id, checkInDate: checkIn, checkOutDate: checkOut, rateType: 'STANDARD' });
      setSuccess(`Room ${room.roomNumber} booked successfully!`);
      search();
    } catch (err) {
      setError(err.response?.data || 'Booking failed');
    }
  };

  const nights = checkIn && checkOut
    ? Math.max(0, (new Date(checkOut) - new Date(checkIn)) / 86400000)
    : 0;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Find a Room</h1>

      <div style={styles.searchBar}>
        <label style={styles.label}>Check-in
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]} style={styles.input} />
        </label>
        <label style={styles.label}>Check-out
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]} style={styles.input} />
        </label>
        <button onClick={search} style={styles.searchBtn} disabled={!checkIn || !checkOut}>
          Search
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {loading && <p>Searching...</p>}

      {searched && !loading && (
        <>
          <p style={styles.resultCount}>
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
            {nights > 0 ? ` for ${nights} night${nights !== 1 ? 's' : ''}` : ''}
          </p>
          <div style={styles.grid}>
            {rooms.map((room) => (
              <div key={room.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.roomNumber}>Room {room.roomNumber}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.06rem', color: FLOOR_COLORS[room.floor] || '#737873' }}>{FLOOR_NAMES[room.floor]}</span>
                </div>
                <div style={styles.badges}>
                  <span style={styles.badge}>{room.qualityLevel}</span>
                  <span style={styles.badge}>{room.roomType}</span>
                  <span style={styles.badge}>{room.numBeds}x {room.bedType}</span>
                  {room.smoking && <span style={{ ...styles.badge, background: 'rgba(75,12,15,0.08)', color: '#4b0c0f' }}>Smoking</span>}
                </div>
                {room.description && <p style={styles.desc}>{room.description}</p>}
                <div style={styles.cardFooter}>
                  <span style={styles.rate}>${room.dailyRate.toFixed(2)}/night</span>
                  {nights > 0 && (
                    <span style={styles.total}>Total: ${(room.dailyRate * nights).toFixed(2)}</span>
                  )}
                  {user?.role === 'GUEST' && (
                    <button onClick={() => handleBook(room)} style={styles.bookBtn}>
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const FLOOR_COLORS = { 1: '#18281e', 2: '#715a3e', 3: '#4b0c0f' };

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' },
  heading: {
    color: '#1b1c19', marginBottom: '2rem',
    fontFamily: "'Noto Serif', Georgia, serif", letterSpacing: '-0.02em',
  },
  searchBar: {
    display: 'flex', gap: '2rem', alignItems: 'flex-end',
    background: '#ffffff', padding: '2rem 2.5rem', borderRadius: '1rem',
    boxShadow: '0 20px 40px rgba(27, 28, 25, 0.06)', marginBottom: '2.5rem',
  },
  label: {
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
    fontSize: '0.7rem', color: '#737873', fontWeight: '600',
    letterSpacing: '0.08rem', textTransform: 'uppercase',
  },
  input: {
    padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #737873',
    background: 'transparent', fontSize: '1rem', outline: 'none',
    color: '#1b1c19', fontFamily: "'Manrope', system-ui, sans-serif",
  },
  searchBtn: {
    padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #18281e, #2d3e33)',
    color: '#ffffff', border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
    fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.08rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
  error: {
    background: 'rgba(75, 12, 15, 0.06)', color: '#4b0c0f',
    padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem',
  },
  success: {
    background: 'rgba(24, 40, 30, 0.06)', color: '#18281e',
    padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem',
  },
  resultCount: { color: '#737873', marginBottom: '1.5rem', fontSize: '0.875rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
  card: {
    background: '#ffffff', borderRadius: '1rem', padding: '1.5rem',
    boxShadow: '0 20px 40px rgba(27, 28, 25, 0.06)',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  roomNumber: {
    fontWeight: '500', fontSize: '1.1rem', color: '#1b1c19',
    fontFamily: "'Noto Serif', Georgia, serif",
  },
  badges: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' },
  badge: {
    background: '#f0eee9', color: '#737873',
    padding: '0.2rem 0.6rem', borderRadius: '0.375rem', fontSize: '0.7rem',
    fontWeight: '500', letterSpacing: '0.04rem',
  },
  desc: { color: '#737873', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.5' },
  cardFooter: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: 'none' },
  rate: {
    fontWeight: '600', color: '#1b1c19',
    fontFamily: "'Noto Serif', Georgia, serif", fontSize: '1.1rem',
  },
  total: { color: '#737873', fontSize: '0.875rem' },
  bookBtn: {
    marginLeft: 'auto', padding: '0.5rem 1.25rem',
    background: 'linear-gradient(135deg, #18281e, #2d3e33)', color: '#ffffff',
    border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
    fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.08rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
};
