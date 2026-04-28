import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkIn, checkOut, createRoom, getReservations, getRooms } from '../services/api';
import StatusMessage from '../components/StatusMessage';

const STATUS_CLASS = {
  CONFIRMED: 'bg-primary/8 text-primary',
  CHECKED_IN: 'bg-secondary/10 text-secondary',
  CHECKED_OUT: 'bg-surface-container text-on-surface-muted',
  CANCELLED: 'bg-tertiary/8 text-tertiary',
};

const toConfirmationCode = (id) => `AH-${String(id).padStart(5, '0')}`;

export default function ClerkDashboard() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('CONFIRMED');
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [arrivalDate, setArrivalDate] = useState('');
  const [preferredRoomId, setPreferredRoomId] = useState('');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    floor: 1,
    roomType: 'STANDARD',
    qualityLevel: 'ECONOMY',
    bedType: 'QUEEN',
    numBeds: 1,
    smoking: false,
    dailyRate: 99.99,
    description: '',
  });

  const loadData = async () => {
    try {
      const [resRes, roomRes] = await Promise.all([getReservations(), getRooms()]);
      setReservations(resRes.data);
      setRooms(roomRes.data);
    } catch {
      setError('Failed to load check-in operations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredReservations = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();
    return reservations.filter((reservation) => {
      if (statusFilter && reservation.status !== statusFilter) return false;
      if (arrivalDate && reservation.checkInDate !== arrivalDate) return false;
      if (!normalizedQuery) return true;
      const code = toConfirmationCode(reservation.id).toLowerCase();
      const roomNumber = String(reservation.roomNumber ?? '').toLowerCase();
      const fallbackGuestToken = `guest-${reservation.userId}`.toLowerCase();
      return (
        code.includes(normalizedQuery)
        || String(reservation.id).includes(normalizedQuery)
        || roomNumber.includes(normalizedQuery)
        || fallbackGuestToken.includes(normalizedQuery)
      );
    });
  }, [reservations, search, statusFilter, arrivalDate]);

  const selectedReservation = useMemo(
    () => reservations.find((reservation) => reservation.id === selectedReservationId) || null,
    [reservations, selectedReservationId],
  );

  const suggestedRooms = useMemo(() => rooms.filter((room) => room.status === 'AVAILABLE'), [rooms]);
  const checkedInReservations = useMemo(
    () => reservations.filter((reservation) => reservation.status === 'CHECKED_IN'),
    [reservations],
  );

  const handleCheckIn = async () => {
    if (!selectedReservation) {
      setError('Select a reservation before checking in.');
      return;
    }

    setError('');
    setSuccess('');
    try {
      await checkIn(selectedReservation.id);
      setSuccess(
        `Checked in ${toConfirmationCode(selectedReservation.id)} successfully${
          preferredRoomId ? `. Preferred room ${preferredRoomId} was noted locally.` : '.'
        }`,
      );
      setPreferredRoomId('');
      await loadData();
    } catch (err) {
      setError(err.response?.data || 'Check-in failed.');
    }
  };

  const handleCheckOut = async (reservationId) => {
    setError('');
    setSuccess('');
    try {
      await checkOut(reservationId);
      setSuccess(`Checked out ${toConfirmationCode(reservationId)} successfully.`);
      await loadData();
    } catch (err) {
      setError(err.response?.data || 'Check-out failed.');
    }
  };

  const handleAddRoom = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createRoom(newRoom);
      setSuccess(`Room ${newRoom.roomNumber} added.`);
      setNewRoom({
        roomNumber: '',
        floor: 1,
        roomType: 'STANDARD',
        qualityLevel: 'ECONOMY',
        bedType: 'QUEEN',
        numBeds: 1,
        smoking: false,
        dailyRate: 99.99,
        description: '',
      });
      setShowAddRoom(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data || 'Failed to add room.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-10">
        <p className="text-on-surface-muted">Loading clerk operations…</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-on-surface tracking-tight mb-2">Process Check-In</h1>
        <p className="text-on-surface-muted text-sm">
          Find reservation, verify guest details, pick a room option, and complete check-in.
        </p>
      </header>

      <div className="space-y-4 mb-6">
        <StatusMessage type="error" message={error} />
        <StatusMessage type="success" message={success} />
      </div>

      <section className="bg-surface-lowest rounded-2xl p-6 shadow-ambient mb-8">
        <h2 className="font-serif text-on-surface text-xl mb-5">1. Find Reservation</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
            Guest / Confirmation / ID
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
              placeholder="e.g. AH-00012 or guest-4"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
            Status
            <select
              className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CHECKED_OUT">Checked Out</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
            Arrival Date
            <input
              type="date"
              className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />
          </label>
          <div className="text-xs text-on-surface-muted self-end pb-2">
            <p className="font-semibold uppercase tracking-[0.08rem]">Result Count</p>
            <p className="text-on-surface mt-1">{filteredReservations.length} match(es)</p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <section className="bg-surface-lowest rounded-2xl p-6 shadow-ambient">
          <h2 className="font-serif text-on-surface text-xl mb-4">2. Verify Reservation</h2>
          {filteredReservations.length === 0 ? (
            <div className="bg-surface-container rounded-xl p-5">
              <p className="text-on-surface">Reservation not found.</p>
              <p className="text-sm text-on-surface-muted mt-1">Verify details and start a new guest booking flow if needed.</p>
              <Link to="/rooms" className="inline-block mt-4 text-sm font-semibold text-primary">Open Reservation Search</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReservations.map((reservation) => (
                <button
                  key={reservation.id}
                  type="button"
                  onClick={() => setSelectedReservationId(reservation.id)}
                  className={`w-full text-left rounded-xl p-4 border transition-colors ${
                    selectedReservationId === reservation.id
                      ? 'border-primary/35 bg-surface-container'
                      : 'border-outline-variant/20 bg-surface'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <strong className="font-serif text-on-surface">{toConfirmationCode(reservation.id)}</strong>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wide ${STATUS_CLASS[reservation.status] || 'bg-surface-container text-on-surface-muted'}`}>
                      {reservation.status}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-muted">
                    Guest #{reservation.userId} • Room {reservation.roomNumber} • {reservation.checkInDate} to {reservation.checkOutDate}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="bg-surface-lowest rounded-2xl p-6 shadow-ambient h-fit lg:sticky lg:top-24">
          <h2 className="font-serif text-on-surface text-xl mb-4">3. Assign & Complete</h2>
          {!selectedReservation ? (
            <p className="text-sm text-on-surface-muted">Select a reservation to process check-in.</p>
          ) : (
            <div className="space-y-4">
              <div className="bg-surface-container rounded-lg p-4">
                <p className="text-xs uppercase tracking-[0.08rem] text-on-surface-muted mb-2">Reservation</p>
                <p className="font-serif text-on-surface">{toConfirmationCode(selectedReservation.id)}</p>
                <p className="text-sm text-on-surface-muted mt-1">
                  Current Room {selectedReservation.roomNumber} • Guest #{selectedReservation.userId}
                </p>
              </div>

              <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted block">
                Preferred Available Room (UI-assist)
                <select
                  className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
                  value={preferredRoomId}
                  onChange={(e) => setPreferredRoomId(e.target.value)}
                >
                  <option value="">Keep current assignment</option>
                  {suggestedRooms.map((room) => (
                    <option key={room.id} value={room.roomNumber}>
                      Room {room.roomNumber} • Floor {room.floor} • {room.roomType}
                    </option>
                  ))}
                </select>
              </label>

              <p className="text-xs text-on-surface-muted">
                If no suitable room appears, offer alternatives or upgrade options before completion.
              </p>

              <button
                type="button"
                onClick={handleCheckIn}
                disabled={selectedReservation.status !== 'CONFIRMED'}
                className="w-full py-3.5 bg-linear-to-br from-primary to-primary-container text-white border-0 rounded-xl text-xs font-semibold uppercase tracking-[0.1rem] cursor-pointer font-sans disabled:opacity-40"
              >
                Complete Check-In
              </button>

              {selectedReservation.status !== 'CONFIRMED' && (
                <p className="text-xs text-tertiary">Only reservations in CONFIRMED status can be checked in.</p>
              )}
            </div>
          )}
        </aside>
      </div>

      <section className="mt-8 grid lg:grid-cols-2 gap-8">
        <div className="bg-surface-lowest rounded-2xl p-6 shadow-ambient">
          <h2 className="font-serif text-on-surface text-xl mb-4">4. Process Check-Out</h2>
          {checkedInReservations.length === 0 ? (
            <p className="text-sm text-on-surface-muted">No checked-in reservations are ready for check-out.</p>
          ) : (
            <div className="space-y-3">
              {checkedInReservations.map((reservation) => (
                <div key={reservation.id} className="rounded-xl border border-outline-variant/20 p-4 bg-surface">
                  <p className="font-serif text-on-surface">{toConfirmationCode(reservation.id)}</p>
                  <p className="text-sm text-on-surface-muted mt-1">
                    Guest #{reservation.userId} • Room {reservation.roomNumber}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCheckOut(reservation.id)}
                    className="mt-3 px-4 py-2 bg-surface-container text-on-surface rounded-xl text-xs font-semibold uppercase tracking-[0.08rem]"
                  >
                    Complete Check-Out
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-lowest rounded-2xl p-6 shadow-ambient">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-on-surface text-xl">5. Room Inventory Entry</h2>
            <button
              type="button"
              onClick={() => setShowAddRoom((prev) => !prev)}
              className="px-4 py-2 bg-linear-to-br from-secondary to-[#8a6e50] text-white rounded-xl text-xs font-semibold uppercase tracking-[0.08rem]"
            >
              {showAddRoom ? 'Close' : 'Add Room'}
            </button>
          </div>
          {showAddRoom ? (
            <form onSubmit={handleAddRoom} className="grid grid-cols-2 gap-4">
              <label className="col-span-2 text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                Room Number
                <input
                  required
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, roomNumber: e.target.value }))}
                  className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                Floor
                <select
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, floor: Number(e.target.value) }))}
                  className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                Room Type
                <select
                  value={newRoom.roomType}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, roomType: e.target.value }))}
                  className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
                >
                  {['SINGLE', 'DOUBLE', 'FAMILY', 'SUITE', 'DELUXE', 'STANDARD'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                Quality
                <select
                  value={newRoom.qualityLevel}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, qualityLevel: e.target.value }))}
                  className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
                >
                  {['EXECUTIVE', 'BUSINESS', 'COMFORT', 'ECONOMY'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                Bed Type
                <select
                  value={newRoom.bedType}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, bedType: e.target.value }))}
                  className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
                >
                  {['TWIN', 'FULL', 'QUEEN', 'KING'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                Bed Count
                <input
                  type="number"
                  min={1}
                  value={newRoom.numBeds}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, numBeds: Number(e.target.value) }))}
                  className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                Daily Rate
                <input
                  type="number"
                  step="0.01"
                  value={newRoom.dailyRate}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, dailyRate: Number(e.target.value) }))}
                  className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
                />
              </label>
              <label className="col-span-2 text-xs font-semibold uppercase tracking-[0.08rem] text-on-surface-muted">
                Description
                <input
                  value={newRoom.description}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, description: e.target.value }))}
                  className="mt-2 w-full border-0 border-b border-outline bg-transparent pb-2 text-on-surface outline-none"
                />
              </label>
              <label className="col-span-2 inline-flex items-center gap-2 text-sm text-on-surface-muted">
                <input
                  type="checkbox"
                  checked={newRoom.smoking}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, smoking: e.target.checked }))}
                  className="accent-primary"
                />
                Smoking room
              </label>
              <button
                type="submit"
                className="col-span-2 py-3 bg-linear-to-br from-primary to-primary-container text-white rounded-xl text-xs font-semibold uppercase tracking-[0.08rem]"
              >
                Save Room
              </button>
            </form>
          ) : (
            <p className="text-sm text-on-surface-muted">Use this section to add new room inventory entries without leaving check-in operations.</p>
          )}
        </div>
      </section>
    </div>
  );
}
