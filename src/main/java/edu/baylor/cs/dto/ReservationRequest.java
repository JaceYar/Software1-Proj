package edu.baylor.cs.dto;

public record ReservationRequest(
        int roomId,
        String checkInDate,
        String checkOutDate,
        String rateType
) {}
