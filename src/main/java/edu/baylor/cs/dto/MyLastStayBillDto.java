package edu.baylor.cs.dto;

import java.util.List;

public record MyLastStayBillDto(
        StaySummaryDto stay,
        List<StorePurchaseDto> storePurchases,
        double roomCharge,
        double storeChargeTotal,
        double grandTotal,
        boolean fullyPaid
) {}
