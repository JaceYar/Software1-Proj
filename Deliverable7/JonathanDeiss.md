# Jonathan Deiss — Use Cases

## Hotel Clerk Login

| Use Case Name | Hotel Clerk Login |
|---------------|-----------------|
| Actor         | Hotel Clerk    |
| Author        | Jonathan Deiss |
| Preconditions | 1. System is operational<br>2. User has a valid hotel clerk account with a username and password |
| Postconditions | 1. Hotel clerk is successfully logged in<br>2. Clerk is redirected to the clerk dashboard |
| Main Success Scenario | 1. The clerk navigates to the login page<br>2. The clerk enters their username<br>3. The clerk enters their password<br>4. The clerk submits the credentials<br>5. The system validates the input format<br>6. The system verifies the credentials against the database<br>7. The system creates a clerk session<br>8. The system redirects the clerk to the clerk dashboard |
| Extensions | [6]a. **Invalid credentials**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 The system displays "Invalid username or password"<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 Return to step 2<br>[6]b. **Account not found**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b1 The system displays "Invalid username or password" (generic, for security)<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b2 Use case ends |
| Special Reqs | ● Passwords must be stored hashed in the database<br>● All login attempts (successful and failed) must be logged |

```mermaid
sequenceDiagram
    actor Clerk
    participant System

    Clerk->>System: loginClerk(username, password)
    System-->>Clerk: sessionConfirmation
```

### Operation Contract

| Operation | `loginClerk(username: String, password: String)` |
|---|---|
| Cross References | Use Case: Hotel Clerk Login |
| Preconditions | 1. System is operational<br>2. A hotel clerk account with the given username exists in the system |
| Postconditions | 1. A clerk session was created<br>2. HotelClerk.isLoggedIn was set to true<br>3. The login attempt was logged |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:LoginHandler` | Use-case controller; receives the `loginClerk` system operation |
| **Information Expert + Pure Fabrication** | `:ClerkCatalog` | Holds all HotelClerk accounts; finds by username and verifies credentials |
| **Information Expert** | `clerk:HotelClerk` | Manages its own `isLoggedIn` flag and verifies its own password |
| **Pure Fabrication** | `:SessionStore` | Creates and stores the authenticated clerk session |
| **Pure Fabrication** | `:AuditLog` | Logs all login attempts for auditing |

```mermaid
sequenceDiagram
    actor Clerk
    participant ctrl as :LoginHandler
    participant cc as :ClerkCatalog
    participant c as clerk:HotelClerk
    participant ss as :SessionStore
    participant al as :AuditLog

    Clerk->>ctrl: loginClerk(username, password)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>cc: findByUsername(username)
    activate cc
    Note right of cc: GRASP: Information Expert<br>+ Pure Fabrication
    cc-->>ctrl: clerk
    deactivate cc

    ctrl->>c: verifyPassword(password)
    activate c
    Note right of c: GRASP: Information Expert<br>(HotelClerk verifies its own credentials)
    c-->>ctrl: true
    deactivate c

    ctrl->>c: setLoggedIn(true)
    activate c
    c-->>ctrl: ok
    deactivate c

    ctrl->>ss: createSession(clerk)
    activate ss
    Note right of ss: GRASP: Pure Fabrication
    ss-->>ctrl: session
    deactivate ss

    ctrl->>al: logLoginAttempt(username, success)
    activate al
    Note right of al: GRASP: Pure Fabrication
    al-->>ctrl: ok
    deactivate al

    ctrl-->>Clerk: sessionConfirmation
    deactivate ctrl
```

---

## View Room Status

| Use Case Name | View Room Status |
|---------------|-----------------|
| Actor         | Hotel Clerk    |
| Author        | Jonathan Deiss |
| Preconditions | 1. Hotel clerk is logged into the system<br>2. Room data exists in the database |
| Postconditions | 1. The clerk has viewed the current status of all rooms<br>2. No data is modified |
| Main Success Scenario | 1. The clerk navigates to the room status dashboard<br>2. The system retrieves all rooms from the database<br>3. The system displays each room with its room number, floor/theme, and current status (available, reserved, or occupied)<br>4. The clerk optionally filters rooms by floor or status<br>5. The system updates the displayed list based on the applied filter<br>6. The system displays a summary count of rooms by status |
| Extensions | [2]a. **No rooms in system**<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]a1 The system displays a message indicating no rooms have been added yet<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]a2 Use case ends<br>[5]a. **No rooms match filter**<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a1 The system displays a message indicating no rooms match the selected criteria |
| Special Reqs | ● Room statuses must reflect real-time reservation and check-in data<br>● The dashboard must display a summary count of rooms by status |

```mermaid
sequenceDiagram
    actor Clerk
    participant System

    Clerk->>System: viewRoomStatus(floorFilter, statusFilter)
    System-->>Clerk: roomStatusList
```

### Operation Contract

| Operation | `viewRoomStatus(floorFilter: String, statusFilter: String)` |
|---|---|
| Cross References | Use Case: View Room Status |
| Preconditions | 1. Hotel clerk is logged in<br>2. Room data exists in the database |
| Postconditions | 1. No domain model state was changed (read-only operation)<br>2. A list of rooms with their current status was retrieved and displayed, filtered by the given criteria if provided |

---

## Clerk Makes Reservation for Guest

| Use Case Name | Clerk Makes Reservation for Guest |
|---------------|-----------------|
| Actor         | Hotel Clerk    |
| Author        | Jonathan Deiss |
| Preconditions | 1. Hotel clerk is logged into the system<br>2. Room and reservation data exists in the database<br>3. The guest has an existing account or the clerk can look one up |
| Postconditions | 1. A new reservation is created in the system and associated with the guest<br>2. The selected room is marked as reserved for the specified dates<br>3. Guest information is recorded and linked to the reservation |
| Main Success Scenario | 1. The clerk selects "Make Reservation" from the clerk dashboard<br>2. The clerk searches for the guest by name or email<br>3. The system displays matching guest records<br>4. The clerk selects the guest<br>5. The clerk enters the check-in date, check-out date, and desired room type<br>6. The system displays available rooms matching the criteria<br>7. The clerk selects a room<br>8. The clerk selects a rate type (standard, promotion, group, or non-refundable)<br>9. The system calculates the total cost based on the room's quality level and rate type<br>10. The system creates the reservation and associates it with the guest<br>11. The system displays the reservation confirmation details |
| Extensions | [3]a. **Guest not found**<br>&nbsp;&nbsp;&nbsp;&nbsp;[3]a1 The clerk creates a new guest record<br>&nbsp;&nbsp;&nbsp;&nbsp;[3]a2 Continue from step 5<br>[6]a. **No rooms available for requested criteria**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 The system notifies the clerk that no rooms match the criteria<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 The clerk adjusts dates or room type and returns to step 5<br>[8]a. **Corporate guest**<br>&nbsp;&nbsp;&nbsp;&nbsp;[8]a1 The clerk selects the guest's corporation<br>&nbsp;&nbsp;&nbsp;&nbsp;[8]a2 The system marks the reservation for deferred corporate billing<br>&nbsp;&nbsp;&nbsp;&nbsp;[8]a3 Continue from step 9 |
| Special Reqs | ● Reservations created by a clerk must be flagged as clerk-initiated for auditing purposes<br>● Corporate guest reservations must be marked for deferred billing and not charged at time of booking |

```mermaid
sequenceDiagram
    actor Clerk
    participant System

    Clerk->>System: searchGuest(nameOrEmail)
    System-->>Clerk: matchingGuestRecords
    Clerk->>System: searchAvailableRooms(checkInDate, checkOutDate, roomType)
    System-->>Clerk: availableRooms
    Clerk->>System: clerkMakeReservation(clerkId, guestId, roomId, checkInDate, checkOutDate, rateType)
    System-->>Clerk: reservationConfirmation
```

### Operation Contract

| Operation | `clerkMakeReservation(clerkId: String, guestId: String, roomId: String, checkInDate: Date, checkOutDate: Date, rateType: String)` |
|---|---|
| Cross References | Use Case: Clerk Makes Reservation for Guest |
| Preconditions | 1. Hotel clerk is logged in<br>2. The specified guest account exists in the system<br>3. The selected room is available for the requested dates |
| Postconditions | 1. A new Reservation was created and associated with the guest<br>2. Selected Room was marked as reserved for the specified dates<br>3. Reservation.totalCost was calculated based on quality level and rate type<br>4. Reservation was flagged as clerk-initiated and linked to the creating clerk's account |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:MakeReservationHandler` | Use-case controller; handles all three system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:GuestCatalog` | Holds all Guest data; no direct domain counterpart |
| **Information Expert + Pure Fabrication** | `:RoomCatalog` | Holds all Room data; knows which rooms are available |
| **Creator** | `guest:Guest` | Domain model shows `Guest "1"--"*" Reservation : makes`; Guest aggregates Reservations |
| **Information Expert** | `room:Room` | Has `maxDailyRate`, `promotionRate`, `qualityLevel` — expert on rate data |
| **Information Expert** | `reservation:Reservation` | Has `rateType`, `checkInDate`, `checkOutDate` — calculates its own `totalCost` |
| **Pure Fabrication** | `:ReservationCatalog` | Records and persists all Reservations without burdening domain objects |

```mermaid
sequenceDiagram
    actor Clerk
    participant ctrl as :MakeReservationHandler
    participant gc as :GuestCatalog
    participant g as guest:Guest
    participant rc as :RoomCatalog
    participant r as room:Room
    participant res as reservation:Reservation
    participant rcat as :ReservationCatalog

    Note over Clerk,gc: [1] searchGuest(nameOrEmail)
    Clerk->>ctrl: searchGuest(nameOrEmail)
    activate ctrl
    Note right of ctrl: GRASP: Controller<br>(use-case controller for<br>Clerk Makes Reservation)
    ctrl->>gc: findByNameOrEmail(nameOrEmail)
    activate gc
    Note right of gc: GRASP: Information Expert<br>+ Pure Fabrication
    gc-->>ctrl: guestList
    deactivate gc
    ctrl-->>Clerk: matchingGuestRecords
    deactivate ctrl

    Note over Clerk,rc: [2] searchAvailableRooms(checkInDate, checkOutDate, roomType)
    Clerk->>ctrl: searchAvailableRooms(checkInDate, checkOutDate, roomType)
    activate ctrl
    ctrl->>rc: getAvailableRooms(checkInDate, checkOutDate, roomType)
    activate rc
    Note right of rc: GRASP: Information Expert<br>+ Pure Fabrication
    rc-->>ctrl: availableRooms
    deactivate rc
    ctrl-->>Clerk: availableRooms
    deactivate ctrl

    Note over Clerk,rcat: [3] clerkMakeReservation(clerkId, guestId, roomId, checkInDate, checkOutDate, rateType)
    Clerk->>ctrl: clerkMakeReservation(clerkId, guestId, roomId, checkInDate, checkOutDate, rateType)
    activate ctrl

    ctrl->>gc: getGuest(guestId)
    activate gc
    gc-->>ctrl: guest
    deactivate gc

    ctrl->>rc: getRoom(roomId)
    activate rc
    rc-->>ctrl: room
    deactivate rc

    ctrl->>g: makeReservation(room, checkInDate, checkOutDate, rateType, clerkId)
    activate g
    Note right of g: GRASP: Creator<br>(Guest "1"--"*" Reservation : makes)

    g->>res: <<create>>(room, checkInDate, checkOutDate, rateType)
    activate res

    res->>r: getDailyRate(rateType)
    activate r
    Note right of r: GRASP: Information Expert<br>(Room knows maxDailyRate,<br>promotionRate, qualityLevel)
    r-->>res: dailyRate
    deactivate r

    res->>res: calculateTotalCost(dailyRate, checkInDate, checkOutDate)
    Note right of res: GRASP: Information Expert<br>(Reservation calculates its own totalCost)

    res->>res: setClerkInitiated(clerkId)
    Note right of res: Postcondition: flagged as<br>clerk-initiated for auditing

    res->>r: markAsReserved(checkInDate, checkOutDate)
    activate r
    r-->>res: ok
    deactivate r

    g-->>ctrl: reservation
    deactivate res
    deactivate g

    ctrl->>rcat: add(reservation)
    activate rcat
    Note right of rcat: GRASP: Pure Fabrication<br>(records/persists all Reservations)
    rcat-->>ctrl: ok
    deactivate rcat

    ctrl-->>Clerk: reservationConfirmation
    deactivate ctrl
```
