package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.ReservationsRecord;
import edu.baylor.cs.dto.ReservationDto;
import edu.baylor.cs.dto.ReservationRequest;
import edu.baylor.cs.repository.ReservationRepository;
import edu.baylor.cs.repository.RoomRepository;
import org.jooq.Record;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static edu.baylor.cs.db.Tables.RESERVATIONS;
import static edu.baylor.cs.db.Tables.ROOMS;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ReservationServiceTest {

    @Mock
    ReservationRepository reservationRepository;

    @Mock
    RoomRepository roomRepository;

    @InjectMocks
    ReservationService reservationService;

    private Record mockReservationRecord(int id, int userId, int roomId, String roomNumber,
                                         String checkIn, String checkOut, float rate,
                                         String status, Float fee) {
        Record r = mock(Record.class);
        when(r.get(RESERVATIONS.ID)).thenReturn(id);
        when(r.get(RESERVATIONS.USER_ID)).thenReturn(userId);
        when(r.get(RESERVATIONS.ROOM_ID)).thenReturn(roomId);
        when(r.get(ROOMS.ROOM_NUMBER)).thenReturn(roomNumber);
        when(r.get(RESERVATIONS.CHECK_IN_DATE)).thenReturn(LocalDate.parse(checkIn));
        when(r.get(RESERVATIONS.CHECK_OUT_DATE)).thenReturn(LocalDate.parse(checkOut));
        when(r.get(RESERVATIONS.RATE)).thenReturn(rate);
        when(r.get(RESERVATIONS.RATE_TYPE)).thenReturn("STANDARD");
        when(r.get(RESERVATIONS.STATUS)).thenReturn(status);
        when(r.get(RESERVATIONS.CANCELLATION_FEE)).thenReturn(fee);
        when(r.get(RESERVATIONS.CREATED_AT)).thenReturn(LocalDateTime.now());
        return r;
    }

    private ReservationsRecord mockReservationsRecord(int id, int userId, int roomId,
                                                      String status, LocalDateTime createdAt,
                                                      LocalDate checkIn, LocalDate checkOut, float rate) {
        ReservationsRecord r = mock(ReservationsRecord.class);
        when(r.getId()).thenReturn(id);
        when(r.getUserId()).thenReturn(userId);
        when(r.getRoomId()).thenReturn(roomId);
        when(r.getStatus()).thenReturn(status);
        when(r.getCreatedAt()).thenReturn(createdAt);
        when(r.getCheckInDate()).thenReturn(checkIn);
        when(r.getCheckOutDate()).thenReturn(checkOut);
        when(r.getRate()).thenReturn(rate);
        return r;
    }

    @Test
    void createReservation_noConflict_returnsDto() {
        when(reservationRepository.hasConflict(1, LocalDate.parse("2025-07-01"), LocalDate.parse("2025-07-05")))
                .thenReturn(false);
        when(roomRepository.findDailyRateById(1)).thenReturn(100.0f);
        when(reservationRepository.insert(eq(1), any(ReservationRequest.class), eq(400.0f))).thenReturn(10);
        Record rec = mockReservationRecord(10, 1, 1, "101", "2025-07-01", "2025-07-05", 400.0f, "CONFIRMED", null);
        when(reservationRepository.findByIdWithRoomNumber(10)).thenReturn(rec);

        ReservationDto dto = reservationService.createReservation(1,
                new ReservationRequest(1, "2025-07-01", "2025-07-05", "STANDARD"));

        assertEquals(10, dto.id());
        assertEquals("CONFIRMED", dto.status());
    }

    @Test
    void createReservation_conflict_throwsIllegalArgument() {
        when(reservationRepository.hasConflict(anyInt(), any(), any())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () ->
                reservationService.createReservation(1,
                        new ReservationRequest(1, "2025-07-01", "2025-07-05", "STANDARD")));
    }

    @Test
    void createReservation_roomNotFound_throwsIllegalArgument() {
        when(reservationRepository.hasConflict(anyInt(), any(), any())).thenReturn(false);
        when(roomRepository.findDailyRateById(99)).thenReturn(null);

        assertThrows(IllegalArgumentException.class, () ->
                reservationService.createReservation(1,
                        new ReservationRequest(99, "2025-07-01", "2025-07-05", "STANDARD")));
    }

    @Test
    void cancelReservation_withinGracePeriod_zeroCancellationFee() {
        ReservationsRecord r = mockReservationsRecord(1, 1, 1, "CONFIRMED",
                LocalDateTime.now(), LocalDate.parse("2025-08-01"), LocalDate.parse("2025-08-05"), 400.0f);
        when(reservationRepository.findById(1)).thenReturn(r);
        Record rec = mockReservationRecord(1, 1, 1, "101", "2025-08-01", "2025-08-05", 400.0f, "CANCELLED", 0.0f);
        when(reservationRepository.findByIdWithRoomNumber(1)).thenReturn(rec);

        ReservationDto dto = reservationService.cancelReservation(1, 1, "GUEST");

        verify(reservationRepository).updateCancellation(eq(1), eq(0.0f), any(LocalDateTime.class));
    }

    @Test
    void cancelReservation_outsideGracePeriod_chargesFee() {
        ReservationsRecord r = mockReservationsRecord(1, 1, 1, "CONFIRMED",
                LocalDateTime.now().minusDays(10),
                LocalDate.parse("2025-08-01"), LocalDate.parse("2025-08-05"), 400.0f);
        when(reservationRepository.findById(1)).thenReturn(r);
        Record rec = mockReservationRecord(1, 1, 1, "101", "2025-08-01", "2025-08-05", 400.0f, "CANCELLED", 80.0f);
        when(reservationRepository.findByIdWithRoomNumber(1)).thenReturn(rec);

        reservationService.cancelReservation(1, 1, "GUEST");

        // daily rate = 400/4 = 100; fee = 100 * 0.80 = 80
        verify(reservationRepository).updateCancellation(eq(1), eq(80.0f), any(LocalDateTime.class));
    }

    @Test
    void cancelReservation_alreadyCancelled_throwsIllegalArgument() {
        ReservationsRecord r = mockReservationsRecord(1, 1, 1, "CANCELLED",
                LocalDateTime.now(), LocalDate.parse("2025-08-01"), LocalDate.parse("2025-08-05"), 400.0f);
        when(reservationRepository.findById(1)).thenReturn(r);

        assertThrows(IllegalArgumentException.class,
                () -> reservationService.cancelReservation(1, 1, "GUEST"));
    }

    @Test
    void cancelReservation_checkedIn_throwsIllegalArgument() {
        ReservationsRecord r = mockReservationsRecord(1, 1, 1, "CHECKED_IN",
                LocalDateTime.now(), LocalDate.parse("2025-08-01"), LocalDate.parse("2025-08-05"), 400.0f);
        when(reservationRepository.findById(1)).thenReturn(r);

        assertThrows(IllegalArgumentException.class,
                () -> reservationService.cancelReservation(1, 1, "GUEST"));
    }

    @Test
    void cancelReservation_guestCancelsOtherGuest_throwsIllegalArgument() {
        ReservationsRecord r = mockReservationsRecord(1, 2, 1, "CONFIRMED",
                LocalDateTime.now(), LocalDate.parse("2025-08-01"), LocalDate.parse("2025-08-05"), 400.0f);
        when(reservationRepository.findById(1)).thenReturn(r);

        assertThrows(IllegalArgumentException.class,
                () -> reservationService.cancelReservation(1, 99, "GUEST"));
    }

    @Test
    void checkIn_confirmedReservation_updatesStatusAndRoomStatus() {
        when(reservationRepository.findRoomIdById(1)).thenReturn(5);
        Record rec = mockReservationRecord(1, 1, 5, "101", "2025-08-01", "2025-08-05", 400.0f, "CHECKED_IN", null);
        when(reservationRepository.findByIdWithRoomNumber(1)).thenReturn(rec);

        reservationService.checkIn(1);

        verify(reservationRepository).updateToCheckedIn(1);
        verify(roomRepository).updateStatus(5, "OCCUPIED");
    }

    @Test
    void checkOut_checkedInReservation_updatesStatusAndRoomStatus() {
        ReservationsRecord r = mockReservationsRecord(1, 1, 5, "CHECKED_IN",
                LocalDateTime.now(), LocalDate.parse("2025-08-01"), LocalDate.parse("2025-08-05"), 400.0f);
        when(reservationRepository.findById(1)).thenReturn(r);
        Record rec = mockReservationRecord(1, 1, 5, "101", "2025-08-01", "2025-08-05", 400.0f, "CHECKED_OUT", null);
        when(reservationRepository.findByIdWithRoomNumber(1)).thenReturn(rec);

        reservationService.checkOut(1);

        verify(reservationRepository).updateStatus(1, "CHECKED_OUT");
        verify(roomRepository).updateStatus(5, "AVAILABLE");
    }
}
