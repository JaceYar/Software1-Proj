package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.CartItemRequest;
import edu.baylor.cs.service.AuthService;
import edu.baylor.cs.service.StoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for the hotel store (browse products, cart, checkout).
 */
@RestController
@RequestMapping("/api/store")
public class StoreController {

    private final StoreService storeService;
    private final AuthService authService;

    public StoreController(StoreService storeService, AuthService authService) {
        this.storeService = storeService;
        this.authService = authService;
    }

    @GetMapping("/products")
    public ResponseEntity<?> getProducts() {
        return ResponseEntity.ok(storeService.getAllProducts());
    }

    @GetMapping("/cart")
    public ResponseEntity<?> getCart(@RequestHeader("Authorization") String authHeader) {
        UsersRecord user = authService.getUserFromToken(extractToken(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(storeService.getCart(user.getId()));
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CartItemRequest req) {
        UsersRecord user = authService.getUserFromToken(extractToken(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            return ResponseEntity.ok(storeService.addToCart(user.getId(), req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestHeader("Authorization") String authHeader) {
        UsersRecord user = authService.getUserFromToken(extractToken(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            return ResponseEntity.ok(storeService.checkout(user.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String extractToken(String header) {
        return header != null && header.startsWith("Bearer ") ? header.substring(7) : header;
    }
}
