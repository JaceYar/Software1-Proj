package edu.baylor.cs.service;

import edu.baylor.cs.dto.MyLastStayBillDto;

public interface IBillService {
    MyLastStayBillDto getMyLastStayBill(int userId);
    void payEntireBill(int userId, int reservationId);
}
