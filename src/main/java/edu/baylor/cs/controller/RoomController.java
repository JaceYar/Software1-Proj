package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.RoomDto;
import edu.baylor.cs.service.AuthService;
import edu.baylor.cs.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for room search and management.
 */
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
    private final AuthService authService;

    public RoomController(RoomService roomService, AuthService authService) {
        this.roomService = roomService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableRooms(
            @RequestParam String checkIn,
            @RequestParam String checkOut) {
        return ResponseEntity.ok(roomService.getAvailableRooms(checkIn, checkOut));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoom(@PathVariable int id) {
        try {
            return ResponseEntity.ok(roomService.getRoom(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createRoom(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody RoomDto dto) {
        UsersRecord user = authService.getUserFromToken(extractToken(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        if (!user.getRole().equals("CLERK") && !user.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        try {
            return ResponseEntity.ok(roomService.createRoom(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int id,
            @RequestBody RoomDto dto) {
        UsersRecord user = authService.getUserFromToken(extractToken(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        if (!user.getRole().equals("CLERK") && !user.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        try {
            return ResponseEntity.ok(roomService.updateRoom(id, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String extractToken(String header) {
        return header != null && header.startsWith("Bearer ") ? header.substring(7) : header;
    }
}
