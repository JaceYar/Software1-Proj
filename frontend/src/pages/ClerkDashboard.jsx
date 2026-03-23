import { useState, useEffect } from 'react';
import { getReservations, getRooms, checkIn, checkOut, createRoom } from '../services/api';

const STATUS_COLORS = {
  CONFIRMED: { bg: 'rgba(24,40,30,0.08)', color: '#18281e' },
  CHECKED_IN: { bg: 'rgba(113,90,62,0.1)', color: '#715a3e' },
  CHECKED_OUT: { bg: '#f0eee9', color: '#737873' },
  CANCELLED: { bg: 'rgba(75,12,15,0.08)', color: '#4b0c0f' },
  AVAILABLE: { bg: 'rgba(24,40,30,0.08)', color: '#18281e' },
  OCCUPIED: { bg: 'rgba(113,90,62,0.1)', color: '#715a3e' },
};

export default function ClerkDashboard() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tab, setTab] = useState('reservations');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '', floor: 1, roomType: 'STANDARD', qualityLevel: 'ECONOMY',
    bedType: 'QUEEN', numBeds: 1, smoking: false, dailyRate: 99.99, description: '',
  });

  const load = async () => {
    try {
      const [resRes, roomRes] = await Promise.all([getReservations(), getRooms()]);
      setReservations(resRes.data);
      setRooms(roomRes.data);
    } catch {
      setError('Failed to load data');
    }
  };

  useEffect(() => { load(); }, []);

  const handleCheckIn = async (id) => {
    try { await checkIn(id); setSuccess('Checked in'); load(); }
    catch (err) { setError(err.response?.data || 'Check-in failed'); }
  };

  const handleCheckOut = async (id) => {
    try { await checkOut(id); setSuccess('Checked out'); load(); }
    catch (err) { setError(err.response?.data || 'Check-out failed'); }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await createRoom(newRoom);
      setSuccess('Room added');
      setShowAddRoom(false);
      load();
    } catch (err) {
      setError(err.response?.data || 'Failed to add room');
    }
  };

  const setR = (f) => (e) => setNewRoom({ ...newRoom, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Clerk Dashboard</h1>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.tabs}>
        <button onClick={() => setTab('reservations')} style={tab === 'reservations' ? styles.activeTab : styles.tab}>
          Reservations ({reservations.length})
        </button>
        <button onClick={() => setTab('rooms')} style={tab === 'rooms' ? styles.activeTab : styles.tab}>
          Rooms ({rooms.length})
        </button>
      </div>

      {tab === 'reservations' && (
        <div style={styles.list}>
          {reservations.map((r) => (
            <div key={r.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontFamily: "'Noto Serif', Georgia, serif", fontWeight: '500' }}>#{r.id}</strong>
                  <span style={{ color: '#737873' }}>— Room {r.roomNumber}</span>
                  <span style={{ ...styles.badge, background: (STATUS_COLORS[r.status] || {}).bg, color: (STATUS_COLORS[r.status] || {}).color }}>{r.status}</span>
                </div>
                <span>${r.rate.toFixed(2)}</span>
              </div>
              <div style={styles.meta}>Guest #{r.userId} · {r.checkInDate} → {r.checkOutDate}</div>
              <div style={styles.actions}>
                {r.status === 'CONFIRMED' && (
                  <button onClick={() => handleCheckIn(r.id)} style={styles.inBtn}>Check In</button>
                )}
                {r.status === 'CHECKED_IN' && (
                  <button onClick={() => handleCheckOut(r.id)} style={styles.outBtn}>Check Out</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'rooms' && (
        <>
          <button onClick={() => setShowAddRoom(!showAddRoom)} style={styles.addBtn}>
            {showAddRoom ? 'Cancel' : '+ Add Room'}
          </button>

          {showAddRoom && (
            <form onSubmit={handleAddRoom} style={styles.addForm}>
              <input style={styles.input} placeholder="Room Number" value={newRoom.roomNumber} onChange={setR('roomNumber')} required />
              <select style={styles.input} value={newRoom.floor} onChange={setR('floor')}>
                <option value={1}>Floor 1 — Nature Retreat</option>
                <option value={2}>Floor 2 — Urban Elegance</option>
                <option value={3}>Floor 3 — Vintage Charm</option>
              </select>
              <select style={styles.input} value={newRoom.roomType} onChange={setR('roomType')}>
                {['SINGLE','DOUBLE','FAMILY','SUITE','DELUXE','STANDARD'].map(t => <option key={t}>{t}</option>)}
              </select>
              <select style={styles.input} value={newRoom.qualityLevel} onChange={setR('qualityLevel')}>
                {['EXECUTIVE','BUSINESS','COMFORT','ECONOMY'].map(t => <option key={t}>{t}</option>)}
              </select>
              <select style={styles.input} value={newRoom.bedType} onChange={setR('bedType')}>
                {['TWIN','FULL','QUEEN','KING'].map(t => <option key={t}>{t}</option>)}
              </select>
              <input style={styles.input} type="number" placeholder="# Beds" value={newRoom.numBeds} onChange={setR('numBeds')} min={1} />
              <input style={styles.input} type="number" placeholder="Daily Rate" value={newRoom.dailyRate} onChange={setR('dailyRate')} step="0.01" />
              <input style={styles.input} placeholder="Description" value={newRoom.description} onChange={setR('description')} />
              <label><input type="checkbox" checked={newRoom.smoking} onChange={setR('smoking')} /> Smoking</label>
              <button type="submit" style={styles.submitBtn}>Add Room</button>
            </form>
          )}

          <div style={styles.list}>
            {rooms.map((r) => (
              <div key={r.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <strong>Room {r.roomNumber}</strong> — Floor {r.floor} · {r.roomType} · {r.qualityLevel}
                  <span style={{ ...styles.badge, background: (STATUS_COLORS[r.status] || {}).bg, color: (STATUS_COLORS[r.status] || {}).color }}>{r.status}</span>
                </div>
                <div style={styles.meta}>{r.numBeds}x {r.bedType} · ${r.dailyRate}/night {r.smoking ? '· Smoking' : ''}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' },
  heading: {
    color: '#1b1c19', marginBottom: '1.5rem',
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
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '2rem' },
  tab: {
    padding: '0.6rem 1.5rem', background: '#f0eee9', border: 'none', borderRadius: '0.75rem',
    cursor: 'pointer', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.06rem',
    textTransform: 'uppercase', color: '#737873', fontFamily: "'Manrope', system-ui, sans-serif",
  },
  activeTab: {
    padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg, #18281e, #2d3e33)', color: '#ffffff',
    border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
    fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.06rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    background: '#ffffff', borderRadius: '1rem', padding: '1.25rem',
    boxShadow: '0 20px 40px rgba(27, 28, 25, 0.06)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  badge: {
    padding: '0.2rem 0.6rem', borderRadius: '0.375rem',
    fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.04rem',
  },
  meta: { color: '#737873', fontSize: '0.8rem', marginBottom: '0.75rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  inBtn: {
    padding: '0.4rem 1rem', background: 'rgba(24,40,30,0.08)', color: '#18281e',
    border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
    fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.06rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
  outBtn: {
    padding: '0.4rem 1rem', background: '#f0eee9', color: '#737873',
    border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
    fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.06rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
  addBtn: {
    marginBottom: '1.5rem', padding: '0.6rem 1.5rem',
    background: 'linear-gradient(135deg, #715a3e, #8a6e50)', color: '#ffffff',
    border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
    fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.06rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
  addForm: {
    background: '#ffffff', padding: '1.5rem', borderRadius: '1rem',
    boxShadow: '0 20px 40px rgba(27, 28, 25, 0.06)', marginBottom: '1.5rem',
    display: 'flex', flexDirection: 'column', gap: '1rem',
  },
  input: {
    padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #737873',
    background: 'transparent', fontSize: '0.9rem', outline: 'none',
    color: '#1b1c19', fontFamily: "'Manrope', system-ui, sans-serif",
  },
  submitBtn: {
    padding: '0.75rem', background: 'linear-gradient(135deg, #18281e, #2d3e33)', color: '#ffffff',
    border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
    fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.08rem', textTransform: 'uppercase',
    fontFamily: "'Manrope', system-ui, sans-serif",
  },
};
