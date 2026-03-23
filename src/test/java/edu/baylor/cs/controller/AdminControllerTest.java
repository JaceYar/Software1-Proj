package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.service.IAdminService;
import edu.baylor.cs.service.IAuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    IAdminService adminService;

    @MockBean
    IAuthService authService;

    @Test
    void createClerk_asAdmin_returns200() throws Exception {
        UsersRecord admin = mock(UsersRecord.class);
        when(admin.getRole()).thenReturn("ADMIN");
        when(authService.getUserFromToken(any())).thenReturn(admin);
        when(adminService.createClerk(any(), any())).thenReturn(Map.of(
                "username", "newclerk", "defaultPassword", "changeme123", "message", "created"));

        mockMvc.perform(post("/api/admin/clerks")
                        .header("Authorization", "Bearer token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"newclerk\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newclerk"));
    }

    @Test
    void createClerk_unauthorized_returns401() throws Exception {
        when(authService.getUserFromToken(any())).thenReturn(null);

        mockMvc.perform(post("/api/admin/clerks")
                        .header("Authorization", "Bearer bad")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"x\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createClerk_asGuest_returns403() throws Exception {
        UsersRecord guest = mock(UsersRecord.class);
        when(guest.getRole()).thenReturn("GUEST");
        when(authService.getUserFromToken(any())).thenReturn(guest);

        mockMvc.perform(post("/api/admin/clerks")
                        .header("Authorization", "Bearer token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"x\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void resetPassword_asAdmin_returns200() throws Exception {
        UsersRecord admin = mock(UsersRecord.class);
        when(admin.getRole()).thenReturn("ADMIN");
        when(authService.getUserFromToken(any())).thenReturn(admin);
        when(adminService.resetPassword(any(), any())).thenReturn(Map.of("message", "Password reset successfully"));

        mockMvc.perform(post("/api/admin/reset-password")
                        .header("Authorization", "Bearer token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"alice\", \"newPassword\": \"newpass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password reset successfully"));
    }

    @Test
    void getAllUsers_asAdmin_returns200() throws Exception {
        UsersRecord admin = mock(UsersRecord.class);
        when(admin.getRole()).thenReturn("ADMIN");
        when(authService.getUserFromToken(any())).thenReturn(admin);
        when(adminService.getAllUsers()).thenReturn(List.of(Map.of("username", "alice", "role", "GUEST")));

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("alice"));
    }
}
