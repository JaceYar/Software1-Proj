package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.service.AuthService;
import org.jooq.DSLContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static edu.baylor.cs.db.Tables.USERS;

/**
 * REST endpoints for admin operations (create clerk accounts, reset passwords).
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DSLContext db;
    private final AuthService authService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminController(DSLContext db, AuthService authService) {
        this.db = db;
        this.authService = authService;
    }

    @PostMapping("/clerks")
    public ResponseEntity<?> createClerk(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        UsersRecord admin = authService.getUserFromToken(extractToken(authHeader));
        if (admin == null) return ResponseEntity.status(401).body("Unauthorized");
        if (!admin.getRole().equals("ADMIN")) return ResponseEntity.status(403).body("Forbidden");

        String username = body.get("username");
        String defaultPassword = "changeme123";

        if (db.fetchExists(USERS, USERS.USERNAME.eq(username))) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        db.insertInto(USERS)
                .set(USERS.USERNAME, username)
                .set(USERS.PASSWORD_HASH, passwordEncoder.encode(defaultPassword))
                .set(USERS.NAME, body.getOrDefault("name", username))
                .set(USERS.ROLE, "CLERK")
                .execute();

        return ResponseEntity.ok(Map.of(
                "username", username,
                "defaultPassword", defaultPassword,
                "message", "Clerk account created. Please change the password on first login."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        UsersRecord admin = authService.getUserFromToken(extractToken(authHeader));
        if (admin == null) return ResponseEntity.status(401).body("Unauthorized");
        if (!admin.getRole().equals("ADMIN")) return ResponseEntity.status(403).body("Forbidden");

        String username = body.get("username");
        String newPassword = body.get("newPassword");

        int updated = db.update(USERS)
                .set(USERS.PASSWORD_HASH, passwordEncoder.encode(newPassword))
                .where(USERS.USERNAME.eq(username))
                .execute();

        if (updated == 0) return ResponseEntity.badRequest().body("User not found");
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        UsersRecord admin = authService.getUserFromToken(extractToken(authHeader));
        if (admin == null) return ResponseEntity.status(401).body("Unauthorized");
        if (!admin.getRole().equals("ADMIN")) return ResponseEntity.status(403).body("Forbidden");

        var users = db.select(USERS.ID, USERS.USERNAME, USERS.NAME, USERS.EMAIL, USERS.ROLE, USERS.CREATED_AT)
                .from(USERS)
                .fetch(r -> Map.of(
                        "id", r.get(USERS.ID),
                        "username", r.get(USERS.USERNAME),
                        "name", r.get(USERS.NAME),
                        "email", r.get(USERS.EMAIL) != null ? r.get(USERS.EMAIL) : "",
                        "role", r.get(USERS.ROLE)
                ));
        return ResponseEntity.ok(users);
    }

    private String extractToken(String header) {
        return header != null && header.startsWith("Bearer ") ? header.substring(7) : header;
    }
}
