import { useState, useEffect } from 'react';
import { getReservations, getRooms, checkIn, checkOut, createRoom } from '../services/api';

const STATUS_CLASS = {
  CONFIRMED: 'bg-primary/8 text-primary',
  CHECKED_IN: 'bg-secondary/10 text-secondary',
  CHECKED_OUT: 'bg-surface-container text-on-surface-muted',
  CANCELLED: 'bg-tertiary/8 text-tertiary',
  AVAILABLE: 'bg-primary/8 text-primary',
  OCCUPIED: 'bg-secondary/10 text-secondary',
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

  const inputClass = "w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none font-sans text-sm";
  const selectClass = "w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none font-sans text-sm";

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <h1 className="font-serif text-on-surface tracking-tight mb-6">Clerk Dashboard</h1>

      {error && <div className="bg-tertiary/8 text-tertiary px-4 py-3 rounded-lg mb-5">{error}</div>}
      {success && <div className="bg-primary/8 text-primary px-4 py-3 rounded-lg mb-5">{success}</div>}

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab('reservations')}
          className={`px-6 py-2.5 border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.06rem] cursor-pointer font-sans transition-all ${
            tab === 'reservations'
              ? 'bg-linear-to-br from-primary to-primary-container text-white'
              : 'bg-surface-container text-on-surface-muted hover:text-on-surface'
          }`}
        >
          Reservations ({reservations.length})
        </button>
        <button
          onClick={() => setTab('rooms')}
          className={`px-6 py-2.5 border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.06rem] cursor-pointer font-sans transition-all ${
            tab === 'rooms'
              ? 'bg-linear-to-br from-primary to-primary-container text-white'
              : 'bg-surface-container text-on-surface-muted hover:text-on-surface'
          }`}
        >
          Rooms ({rooms.length})
        </button>
      </div>

      {tab === 'reservations' && (
        <div className="flex flex-col gap-4">
          {reservations.map((r) => (
            <div key={r.id} className="bg-surface-lowest rounded-2xl p-5 shadow-ambient">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <strong className="font-serif font-medium text-on-surface">#{r.id}</strong>
                  <span className="text-on-surface-muted">— Room {r.roomNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wide ${STATUS_CLASS[r.status] || 'bg-surface-container text-on-surface-muted'}`}>
                    {r.status}
                  </span>
                </div>
                <span className="font-serif text-on-surface font-medium">${r.rate.toFixed(2)}</span>
              </div>
              <div className="text-on-surface-muted text-xs mb-3">Guest #{r.userId} · {r.checkInDate} → {r.checkOutDate}</div>
              <div className="flex gap-2">
                {r.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCheckIn(r.id)}
                    className="px-4 py-1.5 bg-primary/8 text-primary border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.06rem] cursor-pointer font-sans"
                  >
                    Check In
                  </button>
                )}
                {r.status === 'CHECKED_IN' && (
                  <button
                    onClick={() => handleCheckOut(r.id)}
                    className="px-4 py-1.5 bg-surface-container text-on-surface-muted border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.06rem] cursor-pointer font-sans"
                  >
                    Check Out
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'rooms' && (
        <>
          <button
            onClick={() => setShowAddRoom(!showAddRoom)}
            className="mb-6 px-6 py-2.5 bg-linear-to-br from-secondary to-[#8a6e50] text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.06rem] cursor-pointer font-sans"
          >
            {showAddRoom ? 'Cancel' : '+ Add Room'}
          </button>

          {showAddRoom && (
            <form onSubmit={handleAddRoom} className="bg-surface-lowest rounded-2xl p-6 shadow-ambient mb-6 flex flex-col gap-5">
              <input className={inputClass} placeholder="Room Number" value={newRoom.roomNumber} onChange={setR('roomNumber')} required />
              <select className={selectClass} value={newRoom.floor} onChange={setR('floor')}>
                <option value={1}>Floor 1 — Nature Retreat</option>
                <option value={2}>Floor 2 — Urban Elegance</option>
                <option value={3}>Floor 3 — Vintage Charm</option>
              </select>
              <select className={selectClass} value={newRoom.roomType} onChange={setR('roomType')}>
                {['SINGLE','DOUBLE','FAMILY','SUITE','DELUXE','STANDARD'].map(t => <option key={t}>{t}</option>)}
              </select>
              <select className={selectClass} value={newRoom.qualityLevel} onChange={setR('qualityLevel')}>
                {['EXECUTIVE','BUSINESS','COMFORT','ECONOMY'].map(t => <option key={t}>{t}</option>)}
              </select>
              <select className={selectClass} value={newRoom.bedType} onChange={setR('bedType')}>
                {['TWIN','FULL','QUEEN','KING'].map(t => <option key={t}>{t}</option>)}
              </select>
              <input className={inputClass} type="number" placeholder="# Beds" value={newRoom.numBeds} onChange={setR('numBeds')} min={1} />
              <input className={inputClass} type="number" placeholder="Daily Rate" value={newRoom.dailyRate} onChange={setR('dailyRate')} step="0.01" />
              <input className={inputClass} placeholder="Description" value={newRoom.description} onChange={setR('description')} />
              <label className="flex items-center gap-2 text-sm text-on-surface-muted cursor-pointer">
                <input type="checkbox" checked={newRoom.smoking} onChange={setR('smoking')} className="accent-primary" />
                Smoking
              </label>
              <button
                type="submit"
                className="py-3 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.08rem] cursor-pointer font-sans"
              >
                Add Room
              </button>
            </form>
          )}

          <div className="flex flex-col gap-4">
            {rooms.map((r) => (
              <div key={r.id} className="bg-surface-lowest rounded-2xl p-5 shadow-ambient">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif font-medium text-on-surface">Room {r.roomNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wide ${STATUS_CLASS[r.status] || 'bg-surface-container text-on-surface-muted'}`}>
                    {r.status}
                  </span>
                </div>
                <div className="text-on-surface-muted text-xs">
                  Floor {r.floor} · {r.roomType} · {r.qualityLevel} · {r.numBeds}x {r.bedType} · ${r.dailyRate}/night{r.smoking ? ' · Smoking' : ''}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
