package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.AuthResponse;
import edu.baylor.cs.dto.LoginRequest;
import edu.baylor.cs.dto.RegisterRequest;
import edu.baylor.cs.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AuthServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    AuthService authService;

    private RegisterRequest makeRegisterReq(String username) {
        return new RegisterRequest(username, "pass", "Test User", "test@email.com",
                "123 Main St", "4111111111111111", "12/26");
    }

    private UsersRecord mockUser(int id, String username, String passwordHash, String role) {
        UsersRecord u = mock(UsersRecord.class);
        when(u.getId()).thenReturn(id);
        when(u.getUsername()).thenReturn(username);
        when(u.getPasswordHash()).thenReturn(passwordHash);
        when(u.getRole()).thenReturn(role);
        when(u.getName()).thenReturn("Test User");
        when(u.getEmail()).thenReturn("test@email.com");
        return u;
    }

    @Test
    void register_newUsername_createsSessionAndReturnsToken() {
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("hashed");
        UsersRecord rec = mockUser(1, "alice", "hashed", "GUEST");
        when(userRepository.insertGuest(any(), eq("hashed"))).thenReturn(rec);

        AuthResponse resp = authService.register(makeRegisterReq("alice"));

        assertNotNull(resp.token());
        assertEquals("alice", resp.user().username());
    }

    @Test
    void register_duplicateUsername_throwsIllegalArgument() {
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThrows(IllegalArgumentException.class,
                () -> authService.register(makeRegisterReq("alice")));
    }

    @Test
    void login_validCredentials_returnsAuthResponse() {
        UsersRecord rec = mockUser(1, "alice", "hashed", "GUEST");
        when(userRepository.findByUsername("alice")).thenReturn(rec);
        when(passwordEncoder.matches("pass", "hashed")).thenReturn(true);

        AuthResponse resp = authService.login(new LoginRequest("alice", "pass"));

        assertNotNull(resp.token());
    }

    @Test
    void login_wrongPassword_throwsIllegalArgument() {
        UsersRecord rec = mockUser(1, "alice", "hashed", "GUEST");
        when(userRepository.findByUsername("alice")).thenReturn(rec);
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThrows(IllegalArgumentException.class,
                () -> authService.login(new LoginRequest("alice", "wrong")));
    }

    @Test
    void login_unknownUser_throwsIllegalArgument() {
        when(userRepository.findByUsername("unknown")).thenReturn(null);

        assertThrows(IllegalArgumentException.class,
                () -> authService.login(new LoginRequest("unknown", "pass")));
    }

    @Test
    void getUserFromToken_validToken_returnsUser() {
        UsersRecord rec = mockUser(1, "alice", "hashed", "GUEST");
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("hashed");
        when(userRepository.insertGuest(any(), any())).thenReturn(rec);

        AuthResponse resp = authService.register(makeRegisterReq("alice"));
        when(userRepository.findById(1)).thenReturn(rec);

        UsersRecord found = authService.getUserFromToken(resp.token());
        assertNotNull(found);
        assertEquals("alice", found.getUsername());
    }

    @Test
    void getUserFromToken_unknownToken_returnsNull() {
        assertNull(authService.getUserFromToken("nonexistent-token"));
    }

    @Test
    void logout_removesToken() {
        UsersRecord rec = mockUser(1, "alice", "hashed", "GUEST");
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("hashed");
        when(userRepository.insertGuest(any(), any())).thenReturn(rec);

        AuthResponse resp = authService.register(makeRegisterReq("alice"));
        authService.logout(resp.token());

        assertNull(authService.getUserFromToken(resp.token()));
    }
}
