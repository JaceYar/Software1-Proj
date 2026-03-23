package edu.baylor.cs.service;

import edu.baylor.cs.dto.ReservationDto;
import edu.baylor.cs.dto.ReservationRequest;

import java.util.List;

public interface IReservationService {
    List<ReservationDto> getAllReservations();
    List<ReservationDto> getReservationsForUser(int userId);
    ReservationDto createReservation(int userId, ReservationRequest req);
    ReservationDto cancelReservation(int reservationId, int requestingUserId, String requestingRole);
    ReservationDto checkIn(int reservationId);
    ReservationDto checkOut(int reservationId);
}
