import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableRooms, createReservation } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FLOOR_NAMES = { 1: 'Nature Retreat', 2: 'Urban Elegance', 3: 'Vintage Charm' };
const FLOOR_TEXT = { 1: 'text-primary', 2: 'text-secondary', 3: 'text-tertiary' };

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

  const inputClass = "border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none font-sans text-base";

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h1 className="font-serif text-on-surface tracking-tight mb-8">Find a Room</h1>

      <div className="flex gap-8 items-end bg-surface-lowest p-8 rounded-2xl shadow-ambient mb-10">
        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
          Check-in
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
          Check-out
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
            className={inputClass}
          />
        </label>
        <button
          onClick={search}
          disabled={!checkIn || !checkOut}
          className="px-8 py-3 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.08rem] cursor-pointer font-sans disabled:opacity-40"
        >
          Search
        </button>
      </div>

      {error && <div className="bg-tertiary/8 text-tertiary px-4 py-3 rounded-lg mb-5">{error}</div>}
      {success && <div className="bg-primary/8 text-primary px-4 py-3 rounded-lg mb-5">{success}</div>}
      {loading && <p className="text-on-surface-muted">Searching...</p>}

      {searched && !loading && (
        <>
          <p className="text-on-surface-muted text-sm mb-6">
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
            {nights > 0 ? ` for ${nights} night${nights !== 1 ? 's' : ''}` : ''}
          </p>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {rooms.map((room) => (
              <div key={room.id} className="bg-surface-lowest rounded-2xl p-6 shadow-ambient">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-serif font-medium text-on-surface text-lg">Room {room.roomNumber}</span>
                  <span className={`text-xs font-semibold tracking-[0.06rem] ${FLOOR_TEXT[room.floor] || 'text-on-surface-muted'}`}>
                    {FLOOR_NAMES[room.floor]}
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap mb-4">
                  <span className="bg-surface-container text-on-surface-muted px-2.5 py-0.5 rounded-md text-xs font-medium">{room.qualityLevel}</span>
                  <span className="bg-surface-container text-on-surface-muted px-2.5 py-0.5 rounded-md text-xs font-medium">{room.roomType}</span>
                  <span className="bg-surface-container text-on-surface-muted px-2.5 py-0.5 rounded-md text-xs font-medium">{room.numBeds}x {room.bedType}</span>
                  {room.smoking && <span className="bg-tertiary/8 text-tertiary px-2.5 py-0.5 rounded-md text-xs font-medium">Smoking</span>}
                </div>
                {room.description && <p className="text-on-surface-muted text-sm mb-4 leading-relaxed">{room.description}</p>}
                <div className="flex items-center gap-3 flex-wrap pt-4">
                  <span className="font-serif font-semibold text-on-surface text-lg">${room.dailyRate.toFixed(2)}/night</span>
                  {nights > 0 && (
                    <span className="text-on-surface-muted text-sm">Total: ${(room.dailyRate * nights).toFixed(2)}</span>
                  )}
                  {user?.role === 'GUEST' && (
                    <button
                      onClick={() => handleBook(room)}
                      className="ml-auto px-5 py-2 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.08rem] cursor-pointer font-sans"
                    >
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
