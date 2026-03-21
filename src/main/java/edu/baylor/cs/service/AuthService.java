package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.*;
import org.jooq.DSLContext;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import static edu.baylor.cs.db.Tables.USERS;

/**
 * Handles user authentication and registration.
 * Uses BCrypt for password hashing and an in-memory token store for sessions.
 */
@Service
public class AuthService {

    private final DSLContext db;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /** In-memory session tokens: token -> userId */
    private final ConcurrentHashMap<String, Integer> sessions = new ConcurrentHashMap<>();

    public AuthService(DSLContext db) {
        this.db = db;
    }

    /**
     * Registers a new guest account.
     * @return AuthResponse with a session token on success
     * @throws IllegalArgumentException if the username is already taken
     */
    public AuthResponse register(RegisterRequest req) {
        boolean exists = db.fetchExists(USERS, USERS.USERNAME.eq(req.username()));
        if (exists) {
            throw new IllegalArgumentException("Username already taken");
        }

        String hash = passwordEncoder.encode(req.password());
        UsersRecord record = db.insertInto(USERS)
                .set(USERS.USERNAME, req.username())
                .set(USERS.PASSWORD_HASH, hash)
                .set(USERS.NAME, req.name())
                .set(USERS.EMAIL, req.email())
                .set(USERS.ADDRESS, req.address())
                .set(USERS.CREDIT_CARD_NUMBER, req.creditCardNumber())
                .set(USERS.CREDIT_CARD_EXPIRY, req.creditCardExpiry())
                .set(USERS.ROLE, "GUEST")
                .returning()
                .fetchOne();

        return createSession(record);
    }

    /**
     * Authenticates a user with username and password.
     * @return AuthResponse with a session token on success
     * @throws IllegalArgumentException if credentials are invalid
     */
    public AuthResponse login(LoginRequest req) {
        UsersRecord user = db.selectFrom(USERS)
                .where(USERS.USERNAME.eq(req.username()))
                .fetchOne();

        if (user == null || !passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return createSession(user);
    }

    /** Invalidates a session token. */
    public void logout(String token) {
        sessions.remove(token);
    }

    /**
     * Resolves a bearer token to a UsersRecord.
     * @return the user or null if the token is invalid/expired
     */
    public UsersRecord getUserFromToken(String token) {
        Integer userId = sessions.get(token);
        if (userId == null) return null;
        return db.selectFrom(USERS).where(USERS.ID.eq(userId)).fetchOne();
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
