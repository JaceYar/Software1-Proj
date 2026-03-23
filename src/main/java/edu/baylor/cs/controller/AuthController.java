package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.*;
import edu.baylor.cs.service.IAuthService;
import edu.baylor.cs.util.TokenExtractor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for authentication (register, login, logout, current user).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IAuthService authService;

    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            return ResponseEntity.ok(authService.register(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            return ResponseEntity.ok(authService.login(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        authService.logout(TokenExtractor.fromHeader(authHeader));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        UsersRecord user = authService.getUserFromToken(TokenExtractor.fromHeader(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(new UserResponse(
                user.getId(), user.getUsername(), user.getName(), user.getEmail(), user.getRole()));
    }
}
