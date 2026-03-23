package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.ReservationDto;
import edu.baylor.cs.service.IAuthService;
import edu.baylor.cs.service.IReservationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservationController.class)
class ReservationControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    IReservationService reservationService;

    @MockBean
    IAuthService authService;

    private ReservationDto sampleDto() {
        return new ReservationDto(1, 1, 1, "101", "2025-07-01", "2025-07-05",
                400.0, "STANDARD", "CONFIRMED", 0.0, "2025-03-01T10:00:00");
    }

    @Test
    void getReservations_asGuest_returnsGuestReservations() throws Exception {
        UsersRecord guest = mock(UsersRecord.class);
        when(guest.getId()).thenReturn(1);
        when(guest.getRole()).thenReturn("GUEST");
        when(authService.getUserFromToken(any())).thenReturn(guest);
        when(reservationService.getReservationsForUser(1)).thenReturn(List.of(sampleDto()));

        mockMvc.perform(get("/api/reservations")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("CONFIRMED"));
    }

    @Test
    void getReservations_unauthorized_returns401() throws Exception {
        when(authService.getUserFromToken(any())).thenReturn(null);

        mockMvc.perform(get("/api/reservations")
                        .header("Authorization", "Bearer bad"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createReservation_authenticated_returns200() throws Exception {
        UsersRecord guest = mock(UsersRecord.class);
        when(guest.getId()).thenReturn(1);
        when(guest.getRole()).thenReturn("GUEST");
        when(authService.getUserFromToken(any())).thenReturn(guest);
        when(reservationService.createReservation(eq(1), any())).thenReturn(sampleDto());

        mockMvc.perform(post("/api/reservations")
                        .header("Authorization", "Bearer token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"roomId\":1,\"checkInDate\":\"2025-07-01\"," +
                                "\"checkOutDate\":\"2025-07-05\",\"rateType\":\"STANDARD\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void checkIn_asClerk_returns200() throws Exception {
        UsersRecord clerk = mock(UsersRecord.class);
        when(clerk.getId()).thenReturn(99);
        when(clerk.getRole()).thenReturn("CLERK");
        when(authService.getUserFromToken(any())).thenReturn(clerk);
        when(reservationService.checkIn(1)).thenReturn(sampleDto());

        mockMvc.perform(post("/api/reservations/1/checkin")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk());
    }

    @Test
    void checkIn_asGuest_returns403() throws Exception {
        UsersRecord guest = mock(UsersRecord.class);
        when(guest.getId()).thenReturn(1);
        when(guest.getRole()).thenReturn("GUEST");
        when(authService.getUserFromToken(any())).thenReturn(guest);

        mockMvc.perform(post("/api/reservations/1/checkin")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isForbidden());
    }
}
