package edu.baylor.cs.dto;

public record BillLineItemDto(
        int productId,
        String name,
        String category,
        int quantity,
        double unitPrice,
        double lineTotal
) {}
