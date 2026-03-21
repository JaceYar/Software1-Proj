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

    Clerk->>System: findStay(nameOrRoomNumberOrReservationId)
    System-->>Clerk: stayDetailsWithBill
    Clerk->>System: processCheckOut(guestId)
    System-->>Clerk: checkOutConfirmation
```

### Operation Contract

| Operation | `processCheckOut(guestId: String)` |
|---|---|
| Cross References | Use Case: Process Check-Out |
| Preconditions | 1. Hotel clerk is logged in<br>2. Guest is currently checked in and occupying a room<br>3. Guest's stay details exist in the database |
| Postconditions | 1. Room.status was changed to 'available'<br>2. Stay.checkOutTimestamp was recorded<br>3. Final bill was calculated and recorded (room charges, store purchases, and incidentals)<br>4. Guest.checkedIn was set to false<br>5. Payment status was documented and logged |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:CheckOutHandler` | Use-case controller; receives both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:ReservationCatalog` | Holds all Reservation data; finds active stays by guest/room/ID |
| **Information Expert** | `reservation:Reservation` | Has `rateType`, `checkInDate`, `checkOutDate`, `totalCost` — calculates its own final bill and records its own check-out state |
| **Information Expert** | `room:Room` | Has `maxDailyRate`, `promotionRate` — expert on rate data used in billing |
| **Information Expert + Pure Fabrication** | `:PurchaseCatalog` | Records all store/incidental purchases linked to a reservation; no direct domain class |
| **Information Expert** | `guest:Guest` | Manages its own `checkedIn` flag |

```mermaid
sequenceDiagram
    actor Clerk
    participant ctrl as :CheckOutHandler
    participant rcat as :ReservationCatalog
    participant res as reservation:Reservation
    participant r as room:Room
    participant pc as :PurchaseCatalog
    participant g as guest:Guest

    Note over Clerk,rcat: [1] findStay(nameOrRoomNumberOrReservationId)
    Clerk->>ctrl: findStay(nameOrRoomNumberOrReservationId)
    activate ctrl
    Note right of ctrl: GRASP: Controller
    ctrl->>rcat: findActiveReservation(query)
    activate rcat
    Note right of rcat: GRASP: Information Expert<br>+ Pure Fabrication
    rcat-->>ctrl: reservation
    deactivate rcat
    ctrl-->>Clerk: stayDetailsWithBill
    deactivate ctrl

    Note over Clerk,g: [2] processCheckOut(guestId)
    Clerk->>ctrl: processCheckOut(guestId)
    activate ctrl

    ctrl->>rcat: getActiveReservationByGuest(guestId)
    activate rcat
    rcat-->>ctrl: reservation
    deactivate rcat

    ctrl->>res: getRoom()
    activate res
    res-->>ctrl: room
    deactivate res

    ctrl->>res: getGuest()
    activate res
    res-->>ctrl: guest
    deactivate res

    ctrl->>res: generateFinalBill()
    activate res
    Note right of res: GRASP: Information Expert<br>(Reservation calculates its own bill)

    res->>r: getDailyRate(rateType)
    activate r
    Note right of r: GRASP: Information Expert<br>(Room knows its rates)
    r-->>res: dailyRate
    deactivate r

    res->>pc: getPurchasesByReservation(reservationId)
    activate pc
    Note right of pc: GRASP: Information Expert<br>+ Pure Fabrication
    pc-->>res: purchases
    deactivate pc

    res->>res: calculateTotal(dailyRate, checkInDate, checkOutDate, purchases)
    Note right of res: GRASP: Information Expert

    res-->>ctrl: finalBill
    deactivate res

    ctrl->>res: recordCheckOut()
    activate res
    Note right of res: GRASP: Information Expert<br>(Reservation records its own<br>checkOutTimestamp and status)
    res-->>ctrl: ok
    deactivate res

    ctrl->>r: setStatus(available)
    activate r
    Note right of r: GRASP: Information Expert<br>(Room manages its own status)
    r-->>ctrl: ok
    deactivate r

    ctrl->>g: setCheckedIn(false)
    activate g
    Note right of g: GRASP: Information Expert<br>(Guest manages its own state)
    g-->>ctrl: ok
    deactivate g

    ctrl-->>Clerk: checkOutConfirmation
    deactivate ctrl
```

