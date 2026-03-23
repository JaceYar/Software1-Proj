package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.AuthResponse;
import edu.baylor.cs.dto.UserResponse;
import edu.baylor.cs.service.IAuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    IAuthService authService;

    @Test
    void register_validRequest_returns200() throws Exception {
        UserResponse user = new UserResponse(1, "alice", "Alice", "a@b.com", "GUEST");
        when(authService.register(any())).thenReturn(new AuthResponse("tok", user));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"alice\",\"password\":\"pass\",\"name\":\"Alice\"," +
                                "\"email\":\"a@b.com\",\"address\":\"123 St\",\"creditCardNumber\":\"4111\"," +
                                "\"creditCardExpiry\":\"12/26\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("tok"));
    }

    @Test
    void login_validCredentials_returns200() throws Exception {
        UserResponse user = new UserResponse(1, "alice", "Alice", "a@b.com", "GUEST");
        when(authService.login(any())).thenReturn(new AuthResponse("tok", user));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"alice\",\"password\":\"pass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("tok"));
    }

    @Test
    void logout_returns200() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk());

        verify(authService).logout("token");
    }

    @Test
    void me_authenticated_returnsUser() throws Exception {
        UsersRecord u = mock(UsersRecord.class);
        when(u.getId()).thenReturn(1);
        when(u.getUsername()).thenReturn("alice");
        when(u.getName()).thenReturn("Alice");
        when(u.getEmail()).thenReturn("a@b.com");
        when(u.getRole()).thenReturn("GUEST");
        when(authService.getUserFromToken("token")).thenReturn(u);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alice"));
    }

    @Test
    void me_unauthorized_returns401() throws Exception {
        when(authService.getUserFromToken(any())).thenReturn(null);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer bad"))
                .andExpect(status().isUnauthorized());
    }
}
