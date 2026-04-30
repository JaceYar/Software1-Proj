package edu.baylor.cs.service;

import edu.baylor.cs.repository.ReservationRepository;
import org.jooq.DSLContext;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BillServiceTest {

    @Mock
    ReservationRepository reservationRepository;

    @Mock
    DSLContext db;

    @InjectMocks
    BillService billService;

    @Test
    void getMyLastStayBill_noReservation_returnsNull() {
        when(reservationRepository.findMostRecentReservationForUserWithRoom(1)).thenReturn(null);

        assertNull(billService.getMyLastStayBill(1));
    }
}
