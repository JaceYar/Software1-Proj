package edu.baylor.cs.dto;

import java.util.List;

public record StorePurchaseDto(
        int billId,
        int orderId,
        double totalAmount,
        String paymentMethod,
        boolean paid,
        String createdAt,
        List<BillLineItemDto> items
) {}
