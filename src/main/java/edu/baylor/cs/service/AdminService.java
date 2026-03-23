package edu.baylor.cs.service;

import edu.baylor.cs.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Admin operations: create clerk accounts, reset passwords, list users.
 */
@Service
public class AdminService implements IAdminService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Map<String, Object> createClerk(String username, String name) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        String defaultPassword = "changeme123";
        userRepository.insertClerk(username, passwordEncoder.encode(defaultPassword), name);
        return Map.of(
                "username", username,
                "defaultPassword", defaultPassword,
                "message", "Clerk account created. Please change the password on first login.");
    }

    @Override
    public Map<String, Object> resetPassword(String username, String newPassword) {
        int updated = userRepository.updatePasswordHash(username, passwordEncoder.encode(newPassword));
        if (updated == 0) throw new IllegalArgumentException("User not found");
        return Map.of("message", "Password reset successfully");
    }

    @Override
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAllSummary();
    }
}
