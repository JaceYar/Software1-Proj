package edu.baylor.cs.repository;

import edu.baylor.cs.db.tables.records.ReservationsRecord;
import edu.baylor.cs.dto.ReservationRequest;
import org.jooq.Record;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository {
    boolean hasConflict(int roomId, LocalDate checkIn, LocalDate checkOut);
    boolean hasCheckedInReservationForUser(int userId);
    List<Record> findAll();
    List<Record> findByUserId(int userId);
    Record findByIdWithRoomNumber(int id);
    ReservationsRecord findById(int id);
    int insert(int userId, ReservationRequest req, float totalRate);
    void updateStatus(int id, String status);
    void updateToCheckedIn(int id);
    void updateCancellation(int id, float fee, LocalDateTime cancelledAt);
    Integer findRoomIdById(int reservationId);
}
