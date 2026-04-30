package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.MyLastStayBillDto;
import edu.baylor.cs.service.IAuthService;
import edu.baylor.cs.service.IBillService;
import edu.baylor.cs.util.TokenExtractor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final IBillService billService;
    private final IAuthService authService;

    public BillController(IBillService billService, IAuthService authService) {
        this.billService = billService;
        this.authService = authService;
    }

    @GetMapping("/my-last-stay")
    public ResponseEntity<?> getMyLastStayBill(@RequestHeader("Authorization") String authHeader) {
        UsersRecord user = authService.getUserFromToken(TokenExtractor.fromHeader(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        MyLastStayBillDto bill = billService.getMyLastStayBill(user.getId());
        if (bill == null) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("stay", null);
            empty.put("storePurchases", new ArrayList<>());
            empty.put("roomCharge", 0.0);
            empty.put("storeChargeTotal", 0.0);
            empty.put("grandTotal", 0.0);
            empty.put("fullyPaid", false);
            return ResponseEntity.ok(empty);
        }
        return ResponseEntity.ok(bill);
    }

    @PostMapping("/reservation/{reservationId}/pay")
    public ResponseEntity<?> payEntireBill(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int reservationId) {
        UsersRecord user = authService.getUserFromToken(TokenExtractor.fromHeader(authHeader));
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        try {
            billService.payEntireBill(user.getId(), reservationId);
            return ResponseEntity.ok(Map.of("message", "Entire bill paid"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
