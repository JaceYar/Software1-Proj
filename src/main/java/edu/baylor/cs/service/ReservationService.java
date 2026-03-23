package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.ReservationsRecord;
import edu.baylor.cs.dto.ReservationDto;
import edu.baylor.cs.dto.ReservationRequest;
import edu.baylor.cs.repository.ReservationRepository;
import edu.baylor.cs.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static edu.baylor.cs.db.Tables.RESERVATIONS;
import static edu.baylor.cs.db.Tables.ROOMS;

/**
 * Manages hotel reservations: creation, cancellation, modification, check-in/check-out.
 */
@Service
public class ReservationService implements IReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public ReservationService(ReservationRepository reservationRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
    }

    /** Returns all reservations for a guest. */
    @Override
    public List<ReservationDto> getReservationsForUser(int userId) {
        return reservationRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    /** Returns all reservations (clerk/admin). */
    @Override
    public List<ReservationDto> getAllReservations() {
        return reservationRepository.findAll().stream().map(this::toDto).toList();
    }

    /**
     * Creates a reservation after verifying room availability.
     * @throws IllegalArgumentException if the room is not available for the requested dates
     */
    @Override
    public ReservationDto createReservation(int userId, ReservationRequest req) {
        LocalDate checkIn = LocalDate.parse(req.checkInDate());
        LocalDate checkOut = LocalDate.parse(req.checkOutDate());

        if (reservationRepository.hasConflict(req.roomId(), checkIn, checkOut)) {
            throw new IllegalArgumentException("Room is not available for those dates");
        }

        Float dailyRate = roomRepository.findDailyRateById(req.roomId());
        if (dailyRate == null) throw new IllegalArgumentException("Room not found");

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        float totalRate = dailyRate * nights;

        int newId = reservationRepository.insert(userId, req, totalRate);
        return fetchReservation(newId);
    }

    /**
     * Cancels a reservation. Applies 80% single-night fee if cancelled more than 2 days after booking.
     * @throws IllegalArgumentException if already cancelled or past check-in
     */
    @Override
    public ReservationDto cancelReservation(int reservationId, int requestingUserId, String requestingRole) {
        ReservationsRecord r = reservationRepository.findById(reservationId);
        if (r == null) throw new IllegalArgumentException("Reservation not found");
        if ("GUEST".equals(requestingRole) && r.getUserId() != requestingUserId) {
            throw new IllegalArgumentException("Cannot cancel another guest's reservation");
        }
        if ("CANCELLED".equals(r.getStatus())) throw new IllegalArgumentException("Already cancelled");
        if ("CHECKED_IN".equals(r.getStatus()) || "CHECKED_OUT".equals(r.getStatus())) {
            throw new IllegalArgumentException("Cannot cancel a reservation that is already checked in/out");
        }

        float fee = 0.0f;
        if (r.getCreatedAt() != null) {
            LocalDate created = r.getCreatedAt().toLocalDate();
            long daysSinceBooking = ChronoUnit.DAYS.between(created, LocalDate.now());
            if (daysSinceBooking > 2) {
                long nights = ChronoUnit.DAYS.between(r.getCheckInDate(), r.getCheckOutDate());
                float dailyRate = nights > 0 ? r.getRate() / nights : r.getRate();
                fee = dailyRate * 0.80f;
            }
        }

        reservationRepository.updateCancellation(reservationId, fee, LocalDateTime.now());
        return fetchReservation(reservationId);
    }

    /** Checks a guest into their room (clerk only). */
    @Override
    public ReservationDto checkIn(int reservationId) {
        Integer roomId = reservationRepository.findRoomIdById(reservationId);
        if (roomId == null) throw new IllegalArgumentException("Reservation not found");

        reservationRepository.updateToCheckedIn(reservationId);
        roomRepository.updateStatus(roomId, "OCCUPIED");
        return fetchReservation(reservationId);
    }

    /** Checks a guest out and frees the room (clerk only). */
    @Override
    public ReservationDto checkOut(int reservationId) {
        ReservationsRecord r = reservationRepository.findById(reservationId);
        if (r == null) throw new IllegalArgumentException("Reservation not found");

        reservationRepository.updateStatus(reservationId, "CHECKED_OUT");
        roomRepository.updateStatus(r.getRoomId(), "AVAILABLE");
        return fetchReservation(reservationId);
    }

    // -------------------------------------------------------------------------

    private ReservationDto fetchReservation(int id) {
        return toDto(reservationRepository.findByIdWithRoomNumber(id));
    }

    private ReservationDto toDto(org.jooq.Record r) {
        Float fee = r.get(RESERVATIONS.CANCELLATION_FEE);
        return new ReservationDto(
                r.get(RESERVATIONS.ID), r.get(RESERVATIONS.USER_ID), r.get(RESERVATIONS.ROOM_ID),
                r.get(ROOMS.ROOM_NUMBER),
                r.get(RESERVATIONS.CHECK_IN_DATE).toString(),
                r.get(RESERVATIONS.CHECK_OUT_DATE).toString(),
                r.get(RESERVATIONS.RATE).doubleValue(),
                r.get(RESERVATIONS.RATE_TYPE), r.get(RESERVATIONS.STATUS),
                fee != null ? fee.doubleValue() : 0.0,
                r.get(RESERVATIONS.CREATED_AT) != null ? r.get(RESERVATIONS.CREATED_AT).toString() : ""
        );
    }
}
