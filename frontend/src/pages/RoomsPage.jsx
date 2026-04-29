import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableRooms, createReservation } from '../services/api';
import { useAuth } from '../context/useAuth';
import StatusMessage from '../components/StatusMessage';

const FLOOR_NAMES = { 1: 'Nature Retreat', 2: 'Urban Elegance', 3: 'Vintage Charm' };
const FLOOR_TEXT = { 1: 'text-primary', 2: 'text-secondary', 3: 'text-tertiary' };
const RATE_TYPES = ['STANDARD', 'PROMOTIONAL', 'GROUP', 'NON_REFUNDABLE'];

export default function RoomsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [rateType, setRateType] = useState('STANDARD');
  const [filters, setFilters] = useState({ floor: '', bedType: '', smokingOnly: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const search = async ({ keepSuccess = false } = {}) => {
    if (!checkIn || !checkOut) {
      setError('Select both check-in and check-out dates.');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out must be after check-in.');
      return;
    }

    setLoading(true);
    setError('');
    if (!keepSuccess) setSuccess('');
    setSelectedRoomId(null);
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

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedRoomId) {
      setError('Select a room before confirming the reservation.');
      return;
    }

    setError('');
    setSuccess('');
    try {
      const res = await createReservation({ roomId: selectedRoomId, checkInDate: checkIn, checkOutDate: checkOut, rateType });
      await search({ keepSuccess: true });
      setSuccess(`Reservation confirmed for Room ${res.data.roomNumber}.`);
    } catch (err) {
      const message = err.response?.data || 'Booking failed';
      setError(`${message}. Please run availability search again.`);
    }
  };

  const nights = checkIn && checkOut
    ? Math.max(0, (new Date(checkOut) - new Date(checkIn)) / 86400000)
    : 0;

  const selectedRoom = useMemo(() => rooms.find((room) => room.id === selectedRoomId) || null, [rooms, selectedRoomId]);

  const visibleRooms = useMemo(
    () =>
      rooms.filter((room) => {
        if (filters.floor && String(room.floor) !== String(filters.floor)) return false;
        if (filters.bedType && room.bedType !== filters.bedType) return false;
        if (filters.smokingOnly && !room.smoking) return false;
        return true;
      }),
    [rooms, filters],
  );

  const inputClass = 'border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none font-sans text-base';

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-on-surface tracking-tight mb-2">Make a Reservation</h1>
        <p className="text-on-surface-muted text-sm">Search availability, select a room, choose a rate, and confirm your booking.</p>
      </header>

      <section className="bg-surface-lowest p-8 rounded-2xl shadow-ambient mb-8">
        <h2 className="font-serif text-on-surface text-xl mb-6">1. Search Available Rooms</h2>
        <div className="grid md:grid-cols-5 gap-6 items-end">
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
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
            Theme
            <select
              className={inputClass}
              value={filters.floor}
              onChange={(e) => setFilters((prev) => ({ ...prev, floor: e.target.value }))}
            >
              <option value="">Any Theme</option>
              <option value="1">Nature Retreat</option>
              <option value="2">Urban Elegance</option>
              <option value="3">Vintage Charm</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
            Bed Type
            <select
              className={inputClass}
              value={filters.bedType}
              onChange={(e) => setFilters((prev) => ({ ...prev, bedType: e.target.value }))}
            >
              <option value="">Any Bed</option>
              <option value="TWIN">Twin</option>
              <option value="FULL">Full</option>
              <option value="QUEEN">Queen</option>
              <option value="KING">King</option>
            </select>
          </label>
          <button
            onClick={search}
            disabled={!checkIn || !checkOut}
            className="px-8 py-3 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.08rem] cursor-pointer font-sans disabled:opacity-40"
          >
            Check Availability
          </button>
        </div>
        <label className="mt-5 inline-flex items-center gap-2 text-sm text-on-surface-muted">
          <input
            type="checkbox"
            checked={filters.smokingOnly}
            onChange={(e) => setFilters((prev) => ({ ...prev, smokingOnly: e.target.checked }))}
            className="accent-primary"
          />
          Smoking rooms only
        </label>
      </section>

      <div className="space-y-4 mb-6">
        <StatusMessage type="error" message={error} />
        <StatusMessage type="success" message={success} />
      </div>

      {loading && <p className="text-on-surface-muted">Searching rooms…</p>}

      {searched && !loading && (
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          <section>
            <p className="text-on-surface-muted text-sm mb-6">
              {visibleRooms.length} room{visibleRooms.length !== 1 ? 's' : ''} available
              {nights > 0 ? ` for ${nights} night${nights !== 1 ? 's' : ''}` : ''}
            </p>

            {visibleRooms.length === 0 ? (
              <div className="bg-surface-lowest rounded-2xl p-6 shadow-ambient">
                <p className="text-on-surface">No rooms match your filters right now.</p>
                <p className="text-sm text-on-surface-muted mt-1">Try adjusting your dates or room preferences.</p>
              </div>
            ) : (
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {visibleRooms.map((room) => (
                  <div key={room.id} className={`bg-surface-lowest rounded-2xl p-6 shadow-ambient border ${selectedRoomId === room.id ? 'border-primary/40' : 'border-transparent'}`}>
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
                      {(!user || user.role === 'GUEST') && (
                        <button
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`ml-auto px-5 py-2 border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.08rem] cursor-pointer font-sans ${
                            selectedRoomId === room.id
                              ? 'bg-secondary text-white'
                              : 'bg-linear-to-br from-primary to-primary-container text-white'
                          }`}
                        >
                          {selectedRoomId === room.id ? 'Selected' : 'Select Room'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="bg-surface-lowest rounded-2xl p-6 shadow-ambient h-fit lg:sticky lg:top-24">
            <h2 className="font-serif text-on-surface text-xl mb-4">2. Review & Confirm</h2>
            {!selectedRoom ? (
              <p className="text-sm text-on-surface-muted">Select a room to continue to confirmation.</p>
            ) : (
              <div className="space-y-4">
                <div className="bg-surface-container p-4 rounded-lg">
                  <p className="text-xs uppercase tracking-[0.08rem] text-on-surface-muted mb-2">Selected Room</p>
                  <p className="font-serif text-on-surface">Room {selectedRoom.roomNumber} • {FLOOR_NAMES[selectedRoom.floor]}</p>
                  <p className="text-sm text-on-surface-muted mt-1">{selectedRoom.roomType} • {selectedRoom.qualityLevel}</p>
                </div>

                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                  Rate Type
                  <select className={inputClass} value={rateType} onChange={(e) => setRateType(e.target.value)}>
                    {RATE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <p className="text-xs text-on-surface-muted">
                  Corporate billing requires backend support and is not yet available in this frontend-only revamp.
                </p>

                <div className="text-sm text-on-surface-muted">
                  Stay total: <span className="text-on-surface font-semibold">${(selectedRoom.dailyRate * nights).toFixed(2)}</span>
                </div>

                <button
                  onClick={handleBook}
                  className="w-full py-3.5 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.1rem] cursor-pointer font-sans"
                >
                  Confirm Reservation
                </button>

                <button
                  onClick={() => navigate('/reservations')}
                  className="w-full py-3 border border-outline-variant/40 bg-transparent text-on-surface rounded-xl text-xs font-semibold uppercase tracking-[0.1rem] cursor-pointer font-sans"
                >
                  Go to My Reservations
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
