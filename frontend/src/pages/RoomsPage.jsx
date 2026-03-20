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
                  <span style={styles.floor}>{FLOOR_NAMES[room.floor]}</span>
                </div>
                <div style={styles.badges}>
                  <span style={styles.badge}>{room.qualityLevel}</span>
                  <span style={styles.badge}>{room.roomType}</span>
                  <span style={styles.badge}>{room.numBeds}x {room.bedType}</span>
                  {room.smoking && <span style={{ ...styles.badge, background: '#f5c6cb' }}>Smoking</span>}
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

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  heading: { color: '#1a1a2e', marginBottom: '1.5rem' },
  searchBar: {
    display: 'flex', gap: '1rem', alignItems: 'flex-end',
    background: '#fff', padding: '1.5rem', borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1.5rem',
  },
  label: { display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#555' },
  input: { padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' },
  searchBtn: {
    padding: '0.625rem 1.5rem', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
  },
  error: { background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  success: { background: '#efe', color: '#060', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  resultCount: { color: '#555', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
  card: {
    background: '#fff', borderRadius: '8px', padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  roomNumber: { fontWeight: 'bold', fontSize: '1.1rem', color: '#1a1a2e' },
  floor: { fontSize: '0.8rem', color: '#888' },
  badges: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' },
  badge: { background: '#eef', color: '#334', padding: '0.15rem 0.5rem', borderRadius: '3px', fontSize: '0.75rem' },
  desc: { color: '#666', fontSize: '0.875rem', marginBottom: '0.75rem' },
  cardFooter: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  rate: { fontWeight: 'bold', color: '#1a1a2e' },
  total: { color: '#555', fontSize: '0.875rem' },
  bookBtn: {
    marginLeft: 'auto', padding: '0.4rem 1rem', background: '#e0c06e', color: '#1a1a2e',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
  },
};
