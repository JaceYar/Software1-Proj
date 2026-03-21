import { useState, useEffect } from 'react';
import { getReservations, getRooms, checkIn, checkOut, createRoom } from '../services/api';

const STATUS_COLORS = {
  CONFIRMED: '#d4edda', CHECKED_IN: '#cce5ff',
  CHECKED_OUT: '#e2e3e5', CANCELLED: '#f8d7da',
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
            <div key={r.id} style={{ ...styles.card, borderLeft: `4px solid ${STATUS_COLORS[r.status] || '#ddd'}` }}>
              <div style={styles.cardTop}>
                <div>
                  <strong>#{r.id}</strong> — Room {r.roomNumber}
                  <span style={{ ...styles.badge, background: STATUS_COLORS[r.status] }}>{r.status}</span>
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
                  <span style={{ ...styles.badge, background: r.status === 'AVAILABLE' ? '#d4edda' : '#f8d7da' }}>{r.status}</span>
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
  page: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
  heading: { color: '#1a1a2e', marginBottom: '1rem' },
  error: { background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  success: { background: '#efe', color: '#060', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { padding: '0.5rem 1.25rem', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  activeTab: { padding: '0.5rem 1.25rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  card: { background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' },
  badge: { marginLeft: '0.5rem', padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.75rem' },
  meta: { color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  inBtn: { padding: '0.3rem 0.75rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  outBtn: { padding: '0.3rem 0.75rem', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  addBtn: { marginBottom: '1rem', padding: '0.5rem 1rem', background: '#e0c06e', color: '#1a1a2e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  addForm: { background: '#fff', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: { padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' },
  submitBtn: { padding: '0.5rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};
