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

    Guest->>System: searchAvailableRooms(checkInDate, checkOutDate, numGuests, numBeds, bedSize)
    System-->>Guest: availableRooms
    Guest->>System: makeReservation(roomId, checkInDate, checkOutDate, rateType, guestInfo, paymentInfo)
    System-->>Guest: reservationConfirmation
```

### Operation Contract

| Operation | `makeReservation(roomId: String, checkInDate: Date, checkOutDate: Date, rateType: String, guestInfo: GuestInfo, paymentInfo: PaymentInfo)` |
|---|---|
| Cross References | Use Case: Make Reservation |
| Preconditions | 1. Guest is logged in<br>2. The selected room is available for the requested dates<br>3. Room and reservation data exist in the database |
| Postconditions | 1. A new Reservation was created in the database<br>2. Selected Room was marked as reserved for the specified dates<br>3. Guest information (name, address, credit card number, expiration date) was recorded<br>4. Reservation.totalCost was calculated based on quality level and rate type |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:MakeReservationHandler` | Use-case controller; handles both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:RoomCatalog` | Holds all Room data; finds available rooms and retrieves a specific room by ID |
| **Information Expert + Pure Fabrication** | `:GuestCatalog` | Retrieves the current guest from the active session |
| **Creator** | `guest:Guest` | Domain model shows `Guest "1"--"*" Reservation : makes`; Guest aggregates Reservations |
| **Information Expert** | `room:Room` | Has `maxDailyRate`, `promotionRate` — expert on rate data |
| **Information Expert** | `reservation:Reservation` | Calculates its own `totalCost` from the room rate and stay dates |
| **Pure Fabrication** | `:ReservationCatalog` | Records and persists all Reservations |

```mermaid
sequenceDiagram
    actor Guest
    participant ctrl as :MakeReservationHandler
    participant rc as :RoomCatalog
    participant gc as :GuestCatalog
    participant g as guest:Guest
    participant r as room:Room
    participant res as reservation:Reservation
    participant rcat as :ReservationCatalog

    Note over Guest,rc: [1] searchAvailableRooms(checkInDate, checkOutDate, numGuests, numBeds, bedSize)
    Guest->>ctrl: searchAvailableRooms(checkInDate, checkOutDate, numGuests, numBeds, bedSize)
    activate ctrl
    Note right of ctrl: GRASP: Controller
    ctrl->>rc: getAvailableRooms(checkInDate, checkOutDate, numGuests, numBeds, bedSize)
    activate rc
    Note right of rc: GRASP: Information Expert<br>+ Pure Fabrication
    rc-->>ctrl: availableRooms
    deactivate rc
    ctrl-->>Guest: availableRooms
    deactivate ctrl

    Note over Guest,rcat: [2] makeReservation(roomId, checkInDate, checkOutDate, rateType, guestInfo, paymentInfo)
    Guest->>ctrl: makeReservation(roomId, checkInDate, checkOutDate, rateType, guestInfo, paymentInfo)
    activate ctrl

    ctrl->>rc: getRoom(roomId)
    activate rc
    rc-->>ctrl: room
    deactivate rc

    ctrl->>gc: getCurrentGuest(guestId)
    activate gc
    Note right of gc: GRASP: Information Expert<br>+ Pure Fabrication
    gc-->>ctrl: guest
    deactivate gc

    ctrl->>g: makeReservation(room, checkInDate, checkOutDate, rateType)
    activate g
    Note right of g: GRASP: Creator<br>(Guest "1"--"*" Reservation : makes)

    g->>res: <<create>>(room, checkInDate, checkOutDate, rateType)
    activate res

    res->>r: getDailyRate(rateType)
    activate r
    Note right of r: GRASP: Information Expert<br>(Room knows its rates)
    r-->>res: dailyRate
    deactivate r

    res->>res: calculateTotalCost(dailyRate, checkInDate, checkOutDate)
    Note right of res: GRASP: Information Expert

    res->>r: markAsReserved(checkInDate, checkOutDate)
    activate r
    r-->>res: ok
    deactivate r

    g-->>ctrl: reservation
    deactivate res
    deactivate g

    ctrl->>rcat: add(reservation)
    activate rcat
    Note right of rcat: GRASP: Pure Fabrication
    rcat-->>ctrl: ok
    deactivate rcat

    ctrl-->>Guest: reservationConfirmation
    deactivate ctrl
```

