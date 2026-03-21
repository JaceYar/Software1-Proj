package edu.baylor.cs.dto;

public record BillDto(
        int id,
        int userId,
        Integer reservationId,
        Integer orderId,
        double totalAmount,
        boolean paid,
        String createdAt
) {}
