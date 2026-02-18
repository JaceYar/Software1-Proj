| Use Case Name | Make Reservation |
|---------------|-----------------|
| Actor         | Hotel Guest     |
| Author        | Erick Martinez  |
| Preconditions | 1. The hotel system is functional and online <br>2. The user is logged in to the system <br>3. Room and reservation data exists in the database <br>4. The user has searched for available rooms |
| Postconditions | 1. A new reservation is created in the system <br>2. The selected room is marked as reserved for the specified dates <br>3. Guest information is recorded (name, address, credit card number, expiration date) <br>4. Confirmation is displayed to the user |
| Main Success Scenario | 1. The user selects a room from the list of available rooms <br>2. The user enters the check-in and check-out dates <br>3. The user selects the rate type (standard, promotion, group, or non-refundable) <br>4. The user enters or confirms their personal information (name, address) <br>5. The user enters payment information (credit card number, expiration date) <br>6. The system validates all input data <br>7. The system verifies room availability for the selected dates <br>8. The system calculates the total cost based on quality level and rate type <br>9. The system creates the reservation and stores it in the database <br>10. The system displays reservation confirmation with details |
| Extensions | [3]a. **Corporate guest selected**<br>&nbsp;&nbsp;&nbsp;&nbsp;[3]a1 The user selects their corporation from the list<br>&nbsp;&nbsp;&nbsp;&nbsp;[3]a2 The system records the corporation for billing purposes<br>&nbsp;&nbsp;&nbsp;&nbsp;[3]a3 Continue from step 4<br>[6]a. **Invalid input data**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 The system displays an error message indicating the invalid fields<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 The user corrects the input<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a3 Continue from step 6<br>[7]a. **Room is no longer available**<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a1 The system notifies the user that the room has been booked<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a2 The system redirects the user to search for available rooms<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a3 Use case ends |
| Special Reqs | ● Credit card information must be securely stored<br>● Reservation must be atomic (all or nothing) |

```mermaid
sequenceDiagram
    actor Guest
    participant System

    Guest->>System: Select room from available list
    Guest->>System: Enter check-in and check-out dates
    Guest->>System: Select rate type
    Guest->>System: Enter/confirm personal information
    Guest->>System: Enter payment information
    System->>System: Validate all input data
    System->>System: Verify room availability for selected dates
    System->>System: Calculate total cost (quality level + rate type)
    System->>System: Create reservation and mark room as reserved
    System-->>Guest: Display reservation confirmation with details
```

---

## Operation Contract

| Operation | `makeReservation(roomId: String, checkInDate: Date, checkOutDate: Date, rateType: String, guestInfo: GuestInfo, paymentInfo: PaymentInfo)` |
|---|---|
| Cross References | Use Case: Make Reservation |
| Preconditions | 1. Guest is logged in<br>2. The selected room is available for the requested dates<br>3. Room and reservation data exist in the database |
| Postconditions | 1. A new Reservation was created in the database<br>2. Selected Room was marked as reserved for the specified dates<br>3. Guest information (name, address, credit card number, expiration date) was recorded<br>4. Reservation.totalCost was calculated based on quality level and rate type |

