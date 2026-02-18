| Use Case Name | Process Check-Out |
|---------------|-----------------|
| Actor         | Hotel Clerk    |
| Author        | [Aaron]    |
| Preconditions | 1. The hotel system is functional and online <br>2. The clerk is logged in to the system <br>3. The guest has been checked in and is currently occupying a room <br>4. The guest's room and stay details exist in the database |
| Postconditions | 1. The guest is checked out and the room is released <br>2. The room status is updated to available (or cleaning/maintenance as configured) <br>3. The check-out date and time are recorded <br>4. The final bill is calculated and recorded <br>5. Any outstanding balance or payment confirmation is documented |
| Main Success Scenario | 1. The clerk searches for the guest by name, room number, or reservation ID <br>2. The system displays the guest's current stay and room assignment <br>3. The clerk confirms the guest's identity and intent to check out <br>4. The system calculates the final bill (room charges, minibar, store purchases, incidentals) <br>5. The system displays the itemized bill to the clerk and guest <br>6. The guest pays any outstanding balance (or confirms prior payment) <br>7. The clerk confirms check-out in the system <br>8. The system updates the room status to available <br>9. The system records the check-out timestamp <br>10. The system displays a check-out confirmation and receipt (if requested) <br>11. The clerk provides the receipt or invoice to the guest |
| Extensions | [1]a. **Guest or room not found**<br>&nbsp;&nbsp;&nbsp;&nbsp;[1]a1 The system displays a message that no matching stay was found<br>&nbsp;&nbsp;&nbsp;&nbsp;[1]a2 The clerk verifies room number or guest name<br>&nbsp;&nbsp;&nbsp;&nbsp;[1]a3 Return to step 1 or use case ends<br>[6]a. **Payment declined or insufficient**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 The system displays payment failure message<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 The clerk requests alternative payment or arranges follow-up<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a3 Return to step 6 or use case ends with balance documented<br>[8]a. **System cannot update room status**<br>&nbsp;&nbsp;&nbsp;&nbsp;[8]a1 The system displays an error and logs the failure<br>&nbsp;&nbsp;&nbsp;&nbsp;[8]a2 The clerk retries or escalates; check-out may be completed manually and room status updated later |
| Special Reqs | ● Check-out must update room availability in real-time for Search Available Room<br>● Final bill must include all room charges and any store or incidental charges linked to the stay<br>● Check-out time and payment status must be logged for auditing |

```mermaid
sequenceDiagram
    actor Clerk
    participant System
    actor Guest

    Clerk->>System: Search guest by name, room number, or reservation ID
    System-->>Clerk: Display guest's current stay and room assignment
    Clerk->>Guest: Confirm identity and intent to check out
    System-->>Clerk: Display itemized bill
    System-->>Guest: Display itemized bill
    Guest->>System: Pay outstanding balance or confirm prior payment
    Clerk->>System: Confirm check-out
    System-->>Clerk: Display check-out confirmation and receipt
    Clerk->>Guest: Provide receipt or invoice
```

---

## Operation Contract

| Operation | `processCheckOut(guestId: String)` |
|---|---|
| Cross References | Use Case: Process Check-Out |
| Preconditions | 1. Hotel clerk is logged in<br>2. Guest is currently checked in and occupying a room<br>3. Guest's stay details exist in the database |
| Postconditions | 1. Room.status was changed to 'available'<br>2. Stay.checkOutTimestamp was recorded<br>3. Final bill was calculated and recorded (room charges, store purchases, and incidentals)<br>4. Guest.checkedIn was set to false<br>5. Payment status was documented and logged |

