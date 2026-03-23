package edu.baylor.cs.service;

import edu.baylor.cs.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    AdminService adminService;

    @Test
    void createClerk_newUsername_returnsCredentialsMap() {
        when(userRepository.existsByUsername("newclerk")).thenReturn(false);
        when(passwordEncoder.encode("changeme123")).thenReturn("hashed");

        Map<String, Object> result = adminService.createClerk("newclerk", "New Clerk");

        assertEquals("newclerk", result.get("username"));
        assertEquals("changeme123", result.get("defaultPassword"));
        verify(userRepository).insertClerk("newclerk", "hashed", "New Clerk");
    }

    @Test
    void createClerk_existingUsername_throwsIllegalArgument() {
        when(userRepository.existsByUsername("existing")).thenReturn(true);

        assertThrows(IllegalArgumentException.class,
                () -> adminService.createClerk("existing", "Existing"));
    }

    @Test
    void resetPassword_existingUser_returnsSuccessMap() {
        when(passwordEncoder.encode("newpass")).thenReturn("hashed");
        when(userRepository.updatePasswordHash("alice", "hashed")).thenReturn(1);

        Map<String, Object> result = adminService.resetPassword("alice", "newpass");

        assertEquals("Password reset successfully", result.get("message"));
    }

    @Test
    void resetPassword_missingUser_throwsIllegalArgument() {
        when(passwordEncoder.encode("newpass")).thenReturn("hashed");
        when(userRepository.updatePasswordHash("ghost", "hashed")).thenReturn(0);

        assertThrows(IllegalArgumentException.class,
                () -> adminService.resetPassword("ghost", "newpass"));
    }

    @Test
    void getAllUsers_delegatesToRepository() {
        List<Map<String, Object>> expected = List.of(Map.of("username", "alice"));
        when(userRepository.findAllSummary()).thenReturn(expected);

        List<Map<String, Object>> result = adminService.getAllUsers();

        assertSame(expected, result);
    }
}
