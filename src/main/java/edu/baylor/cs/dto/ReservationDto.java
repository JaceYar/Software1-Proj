package edu.baylor.cs.dto;

public record ReservationDto(
        int id,
        int userId,
        int roomId,
        String roomNumber,
        String checkInDate,
        String checkOutDate,
        double rate,
        String rateType,
        String status,
        double cancellationFee,
        String createdAt
) {}
