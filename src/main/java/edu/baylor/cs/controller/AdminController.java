package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.service.IAdminService;
import edu.baylor.cs.service.IAuthService;
import edu.baylor.cs.util.TokenExtractor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST endpoints for admin operations (create clerk accounts, reset passwords).
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final IAdminService adminService;
    private final IAuthService authService;

    public AdminController(IAdminService adminService, IAuthService authService) {
        this.adminService = adminService;
        this.authService = authService;
    }

    @PostMapping("/clerks")
    public ResponseEntity<?> createClerk(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        UsersRecord admin = authService.getUserFromToken(TokenExtractor.fromHeader(authHeader));
        if (admin == null) return ResponseEntity.status(401).body("Unauthorized");
        if (!admin.getRole().equals("ADMIN")) return ResponseEntity.status(403).body("Forbidden");

        String username = body.get("username");
        try {
            return ResponseEntity.ok(adminService.createClerk(username, body.getOrDefault("name", username)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        UsersRecord admin = authService.getUserFromToken(TokenExtractor.fromHeader(authHeader));
        if (admin == null) return ResponseEntity.status(401).body("Unauthorized");
        if (!admin.getRole().equals("ADMIN")) return ResponseEntity.status(403).body("Forbidden");

        try {
            return ResponseEntity.ok(adminService.resetPassword(body.get("username"), body.get("newPassword")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        UsersRecord admin = authService.getUserFromToken(TokenExtractor.fromHeader(authHeader));
        if (admin == null) return ResponseEntity.status(401).body("Unauthorized");
        if (!admin.getRole().equals("ADMIN")) return ResponseEntity.status(403).body("Forbidden");

        return ResponseEntity.ok(adminService.getAllUsers());
    }
}
