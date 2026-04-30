package edu.baylor.cs.dto;

public record StaySummaryDto(
        int reservationId,
        String roomNumber,
        String checkInDate,
        String checkOutDate,
        String status,
        double roomCharge
) {}
