package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.ReservationsRecord;
import edu.baylor.cs.dto.ReservationDto;
import edu.baylor.cs.dto.ReservationRequest;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static edu.baylor.cs.db.Tables.*;

/**
 * Manages hotel reservations: creation, cancellation, modification, check-in/check-out.
 */
@Service
public class ReservationService {

    private final DSLContext db;

    public ReservationService(DSLContext db) {
        this.db = db;
    }

    /** Returns all reservations for a guest. */
    public List<ReservationDto> getReservationsForUser(int userId) {
        return db.select(
                        RESERVATIONS.ID, RESERVATIONS.USER_ID, RESERVATIONS.ROOM_ID,
                        ROOMS.ROOM_NUMBER,
                        RESERVATIONS.CHECK_IN_DATE, RESERVATIONS.CHECK_OUT_DATE,
                        RESERVATIONS.RATE, RESERVATIONS.RATE_TYPE, RESERVATIONS.STATUS,
                        RESERVATIONS.CANCELLATION_FEE, RESERVATIONS.CREATED_AT)
                .from(RESERVATIONS)
                .join(ROOMS).on(ROOMS.ID.eq(RESERVATIONS.ROOM_ID))
                .where(RESERVATIONS.USER_ID.eq(userId))
                .fetch(r -> toDto(r));
    }

    /** Returns all reservations (clerk/admin). */
    public List<ReservationDto> getAllReservations() {
        return db.select(
                        RESERVATIONS.ID, RESERVATIONS.USER_ID, RESERVATIONS.ROOM_ID,
                        ROOMS.ROOM_NUMBER,
                        RESERVATIONS.CHECK_IN_DATE, RESERVATIONS.CHECK_OUT_DATE,
                        RESERVATIONS.RATE, RESERVATIONS.RATE_TYPE, RESERVATIONS.STATUS,
                        RESERVATIONS.CANCELLATION_FEE, RESERVATIONS.CREATED_AT)
                .from(RESERVATIONS)
                .join(ROOMS).on(ROOMS.ID.eq(RESERVATIONS.ROOM_ID))
                .fetch(r -> toDto(r));
    }

    /**
     * Creates a reservation after verifying room availability.
     * @throws IllegalArgumentException if the room is not available for the requested dates
     */
    public ReservationDto createReservation(int userId, ReservationRequest req) {
        LocalDate checkIn = LocalDate.parse(req.checkInDate());
        LocalDate checkOut = LocalDate.parse(req.checkOutDate());

        // Check availability
        boolean conflict = db.fetchExists(
                db.selectFrom(RESERVATIONS)
                        .where(RESERVATIONS.ROOM_ID.eq(req.roomId()))
                        .and(RESERVATIONS.STATUS.in("CONFIRMED", "CHECKED_IN"))
                        .and(RESERVATIONS.CHECK_IN_DATE.lt(checkOut))
                        .and(RESERVATIONS.CHECK_OUT_DATE.gt(checkIn))
        );
        if (conflict) throw new IllegalArgumentException("Room is not available for those dates");

        Float dailyRate = db.select(ROOMS.DAILY_RATE)
                .from(ROOMS).where(ROOMS.ID.eq(req.roomId()))
                .fetchOneInto(Float.class);
        if (dailyRate == null) throw new IllegalArgumentException("Room not found");

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        float totalRate = dailyRate * nights;

        ReservationsRecord r = db.insertInto(RESERVATIONS)
                .set(RESERVATIONS.USER_ID, userId)
                .set(RESERVATIONS.ROOM_ID, req.roomId())
                .set(RESERVATIONS.CHECK_IN_DATE, checkIn)
                .set(RESERVATIONS.CHECK_OUT_DATE, checkOut)
                .set(RESERVATIONS.RATE, totalRate)
                .set(RESERVATIONS.RATE_TYPE, req.rateType() != null ? req.rateType() : "STANDARD")
                .set(RESERVATIONS.STATUS, "CONFIRMED")
                .returning()
                .fetchOne();

        return fetchReservation(r.getId());
    }

    /**
     * Cancels a reservation. Applies 80% single-night fee if cancelled more than 2 days after booking.
     * @throws IllegalArgumentException if already cancelled or past check-in
     */
    public ReservationDto cancelReservation(int reservationId, int requestingUserId, String requestingRole) {
        ReservationsRecord r = db.selectFrom(RESERVATIONS)
                .where(RESERVATIONS.ID.eq(reservationId))
                .fetchOne();
        if (r == null) throw new IllegalArgumentException("Reservation not found");
        if ("GUEST".equals(requestingRole) && r.getUserId() != requestingUserId) {
            throw new IllegalArgumentException("Cannot cancel another guest's reservation");
        }
        if ("CANCELLED".equals(r.getStatus())) throw new IllegalArgumentException("Already cancelled");
        if ("CHECKED_IN".equals(r.getStatus()) || "CHECKED_OUT".equals(r.getStatus())) {
            throw new IllegalArgumentException("Cannot cancel a reservation that is already checked in/out");
        }

        // Cancellation fee: if cancelled more than 2 days after booking, charge 80% of one night
        float fee = 0.0f;
        if (r.getCreatedAt() != null) {
            LocalDate created = r.getCreatedAt().toLocalDate();
            long daysSinceBooking = ChronoUnit.DAYS.between(created, LocalDate.now());
            if (daysSinceBooking > 2) {
                long nights = ChronoUnit.DAYS.between(
                        r.getCheckInDate(), r.getCheckOutDate());
                float dailyRate = nights > 0 ? r.getRate() / nights : r.getRate();
                fee = dailyRate * 0.80f;
            }
        }

        db.update(RESERVATIONS)
                .set(RESERVATIONS.STATUS, "CANCELLED")
                .set(RESERVATIONS.CANCELLATION_FEE, fee)
                .set(RESERVATIONS.CANCELLED_AT, LocalDateTime.now())
                .where(RESERVATIONS.ID.eq(reservationId))
                .execute();

        return fetchReservation(reservationId);
    }

    /** Checks a guest into their room (clerk only). */
    public ReservationDto checkIn(int reservationId) {
        Integer roomId = db.select(RESERVATIONS.ROOM_ID).from(RESERVATIONS)
                .where(RESERVATIONS.ID.eq(reservationId)).fetchOneInto(Integer.class);
        if (roomId == null) throw new IllegalArgumentException("Reservation not found");

        db.update(RESERVATIONS)
                .set(RESERVATIONS.STATUS, "CHECKED_IN")
                .where(RESERVATIONS.ID.eq(reservationId))
                .and(RESERVATIONS.STATUS.eq("CONFIRMED"))
                .execute();
        db.update(ROOMS)
                .set(ROOMS.STATUS, "OCCUPIED")
                .where(ROOMS.ID.eq(roomId))
                .execute();
        return fetchReservation(reservationId);
    }

    /** Checks a guest out and frees the room (clerk only). */
    public ReservationDto checkOut(int reservationId) {
        ReservationsRecord r = db.selectFrom(RESERVATIONS)
                .where(RESERVATIONS.ID.eq(reservationId)).fetchOne();
        if (r == null) throw new IllegalArgumentException("Reservation not found");

        db.update(RESERVATIONS)
                .set(RESERVATIONS.STATUS, "CHECKED_OUT")
                .where(RESERVATIONS.ID.eq(reservationId))
                .execute();
        db.update(ROOMS)
                .set(ROOMS.STATUS, "AVAILABLE")
                .where(ROOMS.ID.eq(r.getRoomId()))
                .execute();
        return fetchReservation(reservationId);
    }

    // -------------------------------------------------------------------------

    private ReservationDto fetchReservation(int id) {
        return db.select(
                        RESERVATIONS.ID, RESERVATIONS.USER_ID, RESERVATIONS.ROOM_ID,
                        ROOMS.ROOM_NUMBER,
                        RESERVATIONS.CHECK_IN_DATE, RESERVATIONS.CHECK_OUT_DATE,
                        RESERVATIONS.RATE, RESERVATIONS.RATE_TYPE, RESERVATIONS.STATUS,
                        RESERVATIONS.CANCELLATION_FEE, RESERVATIONS.CREATED_AT)
                .from(RESERVATIONS)
                .join(ROOMS).on(ROOMS.ID.eq(RESERVATIONS.ROOM_ID))
                .where(RESERVATIONS.ID.eq(id))
                .fetchOne(r -> toDto(r));
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
