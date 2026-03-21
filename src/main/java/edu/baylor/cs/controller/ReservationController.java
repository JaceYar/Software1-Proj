package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.ReservationRequest;
import edu.baylor.cs.service.AuthService;
import edu.baylor.cs.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for reservation management (create, cancel, check-in/out).
 */
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final AuthService authService;

    public ReservationController(ReservationService reservationService, AuthService authService) {
        this.reservationService = reservationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getReservations(@RequestHeader("Authorization") String authHeader) {
        UsersRecord user = authService.getUserFromToken(extractToken(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        if (user.getRole().equals("CLERK") || user.getRole().equals("ADMIN")) {
            return ResponseEntity.ok(reservationService.getAllReservations());
        }
        return ResponseEntity.ok(reservationService.getReservationsForUser(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ReservationRequest req) {
        UsersRecord user = authService.getUserFromToken(extractToken(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            return ResponseEntity.ok(reservationService.createReservation(user.getId(), req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelReservation(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int id) {
        UsersRecord user = authService.getUserFromToken(extractToken(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            return ResponseEntity.ok(reservationService.cancelReservation(id, user.getId(), user.getRole()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/checkin")
    public ResponseEntity<?> checkIn(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int id) {
        UsersRecord user = authService.getUserFromToken(extractToken(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        if (!user.getRole().equals("CLERK") && !user.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        try {
            return ResponseEntity.ok(reservationService.checkIn(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<?> checkOut(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int id) {
        UsersRecord user = authService.getUserFromToken(extractToken(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        if (!user.getRole().equals("CLERK") && !user.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        try {
            return ResponseEntity.ok(reservationService.checkOut(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String extractToken(String header) {
        return header != null && header.startsWith("Bearer ") ? header.substring(7) : header;
    }
}
