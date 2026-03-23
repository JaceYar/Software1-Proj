package edu.baylor.cs.repository;

import edu.baylor.cs.db.tables.records.ReservationsRecord;
import edu.baylor.cs.dto.ReservationRequest;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static edu.baylor.cs.db.Tables.RESERVATIONS;
import static edu.baylor.cs.db.Tables.ROOMS;

@Repository
public class JooqReservationRepository implements ReservationRepository {

    private final DSLContext db;

    public JooqReservationRepository(DSLContext db) {
        this.db = db;
    }

    @Override
    public boolean hasConflict(int roomId, LocalDate checkIn, LocalDate checkOut) {
        return db.fetchExists(
                db.selectFrom(RESERVATIONS)
                        .where(RESERVATIONS.ROOM_ID.eq(roomId))
                        .and(RESERVATIONS.STATUS.in("CONFIRMED", "CHECKED_IN"))
                        .and(RESERVATIONS.CHECK_IN_DATE.lt(checkOut))
                        .and(RESERVATIONS.CHECK_OUT_DATE.gt(checkIn))
        );
    }

    @Override
    public boolean hasCheckedInReservationForUser(int userId) {
        return db.fetchExists(
                db.selectFrom(RESERVATIONS)
                        .where(RESERVATIONS.USER_ID.eq(userId))
                        .and(RESERVATIONS.STATUS.eq("CHECKED_IN"))
        );
    }

    @Override
    public List<Record> findAll() {
        return new ArrayList<>(db.select(
                        RESERVATIONS.ID, RESERVATIONS.USER_ID, RESERVATIONS.ROOM_ID,
                        ROOMS.ROOM_NUMBER,
                        RESERVATIONS.CHECK_IN_DATE, RESERVATIONS.CHECK_OUT_DATE,
                        RESERVATIONS.RATE, RESERVATIONS.RATE_TYPE, RESERVATIONS.STATUS,
                        RESERVATIONS.CANCELLATION_FEE, RESERVATIONS.CREATED_AT)
                .from(RESERVATIONS)
                .join(ROOMS).on(ROOMS.ID.eq(RESERVATIONS.ROOM_ID))
                .fetch());
    }

    @Override
    public List<Record> findByUserId(int userId) {
        return new ArrayList<>(db.select(
                        RESERVATIONS.ID, RESERVATIONS.USER_ID, RESERVATIONS.ROOM_ID,
                        ROOMS.ROOM_NUMBER,
                        RESERVATIONS.CHECK_IN_DATE, RESERVATIONS.CHECK_OUT_DATE,
                        RESERVATIONS.RATE, RESERVATIONS.RATE_TYPE, RESERVATIONS.STATUS,
                        RESERVATIONS.CANCELLATION_FEE, RESERVATIONS.CREATED_AT)
                .from(RESERVATIONS)
                .join(ROOMS).on(ROOMS.ID.eq(RESERVATIONS.ROOM_ID))
                .where(RESERVATIONS.USER_ID.eq(userId))
                .fetch());
    }

    @Override
    public Record findByIdWithRoomNumber(int id) {
        return db.select(
                        RESERVATIONS.ID, RESERVATIONS.USER_ID, RESERVATIONS.ROOM_ID,
                        ROOMS.ROOM_NUMBER,
                        RESERVATIONS.CHECK_IN_DATE, RESERVATIONS.CHECK_OUT_DATE,
                        RESERVATIONS.RATE, RESERVATIONS.RATE_TYPE, RESERVATIONS.STATUS,
                        RESERVATIONS.CANCELLATION_FEE, RESERVATIONS.CREATED_AT)
                .from(RESERVATIONS)
                .join(ROOMS).on(ROOMS.ID.eq(RESERVATIONS.ROOM_ID))
                .where(RESERVATIONS.ID.eq(id))
                .fetchOne();
    }

    @Override
    public ReservationsRecord findById(int id) {
        return db.selectFrom(RESERVATIONS).where(RESERVATIONS.ID.eq(id)).fetchOne();
    }

    @Override
    public int insert(int userId, ReservationRequest req, float totalRate) {
        ReservationsRecord r = db.insertInto(RESERVATIONS)
                .set(RESERVATIONS.USER_ID, userId)
                .set(RESERVATIONS.ROOM_ID, req.roomId())
                .set(RESERVATIONS.CHECK_IN_DATE, LocalDate.parse(req.checkInDate()))
                .set(RESERVATIONS.CHECK_OUT_DATE, LocalDate.parse(req.checkOutDate()))
                .set(RESERVATIONS.RATE, totalRate)
                .set(RESERVATIONS.RATE_TYPE, req.rateType() != null ? req.rateType() : "STANDARD")
                .set(RESERVATIONS.STATUS, "CONFIRMED")
                .returning()
                .fetchOne();
        return r.getId();
    }

    @Override
    public void updateStatus(int id, String status) {
        db.update(RESERVATIONS)
                .set(RESERVATIONS.STATUS, status)
                .where(RESERVATIONS.ID.eq(id))
                .execute();
    }

    @Override
    public void updateToCheckedIn(int id) {
        db.update(RESERVATIONS)
                .set(RESERVATIONS.STATUS, "CHECKED_IN")
                .where(RESERVATIONS.ID.eq(id))
                .and(RESERVATIONS.STATUS.eq("CONFIRMED"))
                .execute();
    }

    @Override
    public void updateCancellation(int id, float fee, LocalDateTime cancelledAt) {
        db.update(RESERVATIONS)
                .set(RESERVATIONS.STATUS, "CANCELLED")
                .set(RESERVATIONS.CANCELLATION_FEE, fee)
                .set(RESERVATIONS.CANCELLED_AT, cancelledAt)
                .where(RESERVATIONS.ID.eq(id))
                .execute();
    }

    @Override
    public Integer findRoomIdById(int reservationId) {
        return db.select(RESERVATIONS.ROOM_ID).from(RESERVATIONS)
                .where(RESERVATIONS.ID.eq(reservationId)).fetchOneInto(Integer.class);
    }
}
