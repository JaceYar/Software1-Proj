package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.RoomDto;
import edu.baylor.cs.service.IAuthService;
import edu.baylor.cs.service.IRoomService;
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

@WebMvcTest(RoomController.class)
class RoomControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    IRoomService roomService;

    @MockBean
    IAuthService authService;

    private RoomDto sampleRoom() {
        return new RoomDto(1, "101", 1, "STANDARD", "ECONOMY", "QUEEN", 1, false, 100.0, "desc", "AVAILABLE");
    }

    @Test
    void getAllRooms_returns200() throws Exception {
        when(roomService.getAllRooms()).thenReturn(List.of(sampleRoom()));

        mockMvc.perform(get("/api/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].roomNumber").value("101"));
    }

    @Test
    void getAvailableRooms_returns200() throws Exception {
        when(roomService.getAvailableRooms("2025-07-01", "2025-07-05")).thenReturn(List.of(sampleRoom()));

        mockMvc.perform(get("/api/rooms/available")
                        .param("checkIn", "2025-07-01")
                        .param("checkOut", "2025-07-05"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].roomNumber").value("101"));
    }

    @Test
    void createRoom_asClerk_returns200() throws Exception {
        UsersRecord clerk = mock(UsersRecord.class);
        when(clerk.getRole()).thenReturn("CLERK");
        when(authService.getUserFromToken(any())).thenReturn(clerk);
        when(roomService.createRoom(any())).thenReturn(sampleRoom());

        mockMvc.perform(post("/api/rooms")
                        .header("Authorization", "Bearer token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"roomNumber\":\"101\",\"floor\":1,\"roomType\":\"STANDARD\"," +
                                "\"qualityLevel\":\"ECONOMY\",\"bedType\":\"QUEEN\",\"numBeds\":1," +
                                "\"smoking\":false,\"dailyRate\":100.0,\"description\":\"desc\",\"status\":\"AVAILABLE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomNumber").value("101"));
    }

    @Test
    void createRoom_asGuest_returns403() throws Exception {
        UsersRecord guest = mock(UsersRecord.class);
        when(guest.getRole()).thenReturn("GUEST");
        when(authService.getUserFromToken(any())).thenReturn(guest);

        mockMvc.perform(post("/api/rooms")
                        .header("Authorization", "Bearer token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"roomNumber\":\"101\",\"floor\":1,\"roomType\":\"STANDARD\"," +
                                "\"qualityLevel\":\"ECONOMY\",\"bedType\":\"QUEEN\",\"numBeds\":1," +
                                "\"smoking\":false,\"dailyRate\":100.0,\"description\":\"desc\",\"status\":\"AVAILABLE\"}"))
                .andExpect(status().isForbidden());
    }
}
