package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.*;
import edu.baylor.cs.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Handles user authentication and registration.
 * Uses BCrypt for password hashing and an in-memory token store for sessions.
 */
@Service
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /** In-memory session tokens: token -> userId */
    private final ConcurrentHashMap<String, Integer> sessions = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new guest account.
     * @return AuthResponse with a session token on success
     * @throws IllegalArgumentException if the username is already taken
     */
    @Override
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.username())) {
            throw new IllegalArgumentException("Username already taken");
        }

        String hash = passwordEncoder.encode(req.password());
        UsersRecord record = userRepository.insertGuest(req, hash);

        return createSession(record);
    }

    /**
     * Authenticates a user with username and password.
     * @return AuthResponse with a session token on success
     * @throws IllegalArgumentException if credentials are invalid
     */
    @Override
    public AuthResponse login(LoginRequest req) {
        UsersRecord user = userRepository.findByUsername(req.username());

        if (user == null || !passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return createSession(user);
    }

    /** Invalidates a session token. */
    @Override
    public void logout(String token) {
        sessions.remove(token);
    }

    /**
     * Resolves a bearer token to a UsersRecord.
     * @return the user or null if the token is invalid/expired
     */
    @Override
    public UsersRecord getUserFromToken(String token) {
        Integer userId = sessions.get(token);
        if (userId == null) return null;
        return userRepository.findById(userId);
    }

    // -------------------------------------------------------------------------

    private AuthResponse createSession(UsersRecord user) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, user.getId());
        UserResponse dto = toDto(user);
        return new AuthResponse(token, dto);
    }

    private UserResponse toDto(UsersRecord u) {
        return new UserResponse(u.getId(), u.getUsername(), u.getName(), u.getEmail(), u.getRole());
    }
}
