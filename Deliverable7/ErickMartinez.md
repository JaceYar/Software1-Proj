# Erick Martinez — Use Cases

## Process Check-In

| Use Case Name | Process Check-In |
|---------------|-----------------|
| Actor         | Hotel Clerk    |
| Author        | Erick Martinez |
| Preconditions | 1. The hotel system is functional and online <br>2. The clerk is logged in to the system <br>3. The guest has an existing reservation for the current date <br>4. At least one room matching the reservation criteria is available |
| Postconditions | 1. The guest is checked in and assigned to a specific room <br>2. The room status is updated to occupied <br>3. The check-in date and time are recorded <br>4. The guest can access hotel services (including the store) |
| Main Success Scenario | 1. The clerk searches for the guest's reservation by name or confirmation number <br>2. The system displays the reservation details <br>3. The clerk verifies the guest's identity <br>4. The clerk confirms the reservation details with the guest <br>5. The system displays available rooms matching the reservation <br>6. The clerk selects a room to assign to the guest <br>7. The system allocates the room to the guest <br>8. The system updates the room status to occupied <br>9. The system records the check-in timestamp <br>10. The clerk provides the room key/access information to the guest <br>11. The system displays check-in confirmation |
| Extensions | [1]a. **Reservation not found**<br>&nbsp;&nbsp;&nbsp;&nbsp;[1]a1 The clerk verifies guest information<br>&nbsp;&nbsp;&nbsp;&nbsp;[1]a2 The clerk offers to create a new reservation (see Make Reservation use case)<br>&nbsp;&nbsp;&nbsp;&nbsp;[1]a3 Use case ends or continues with new reservation<br>[4]a. **Guest requests different room type**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 The clerk searches for alternative available rooms<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 The system displays available alternatives with price differences<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a3 The guest selects a new room type<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a4 The system updates the reservation with new rate if applicable<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a5 Continue from step 5<br>[6]a. **No rooms available matching reservation**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 The system notifies the clerk of the situation<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 The clerk offers an upgrade or alternative room<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a3 The guest accepts or declines the alternative<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a4 If declined, the clerk processes a cancellation with no penalty<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a5 Use case ends or continues with alternative room |
| Special Reqs | ● Check-in must update room availability in real-time<br>● Guest must have an active reservation to access store purchasing |

```mermaid
sequenceDiagram
    actor Clerk
    participant System

    Clerk->>System: findReservation(nameOrConfirmationNumber)
    System-->>Clerk: reservationDetails
    Clerk->>System: processCheckIn(reservationId, roomId)
    System-->>Clerk: checkInConfirmation
```

### Operation Contract

| Operation | `processCheckIn(reservationId: String, roomId: String)` |
|---|---|
| Cross References | Use Case: Process Check-In |
| Preconditions | 1. Hotel clerk is logged in<br>2. Guest has a reservation for the current date<br>3. The specified room is available and matches the reservation criteria |
| Postconditions | 1. Room.status was changed to 'occupied'<br>2. Reservation.checkInTimestamp was recorded<br>3. Reservation was associated with the specific assigned Room<br>4. Guest.checkedIn was set to true |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:CheckInHandler` | Use-case controller; handles both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:ReservationCatalog` | Holds all Reservation data; finds reservations by name or confirmation number |
| **Information Expert + Pure Fabrication** | `:RoomCatalog` | Holds all Room data; looks up a specific room by ID |
| **Information Expert** | `reservation:Reservation` | Records its own `checkInTimestamp` and updates its room association |
| **Information Expert** | `room:Room` | Manages its own `status` attribute |
| **Information Expert** | `guest:Guest` | Manages its own `checkedIn` flag |

```mermaid
sequenceDiagram
    actor Clerk
    participant ctrl as :CheckInHandler
    participant rsc as :ReservationCatalog
    participant res as reservation:Reservation
    participant rmc as :RoomCatalog
    participant r as room:Room
    participant g as guest:Guest

    Note over Clerk,rsc: [1] findReservation(nameOrConfirmationNumber)
    Clerk->>ctrl: findReservation(nameOrConfirmationNumber)
    activate ctrl
    Note right of ctrl: GRASP: Controller
    ctrl->>rsc: findReservation(query)
    activate rsc
    Note right of rsc: GRASP: Information Expert<br>+ Pure Fabrication
    rsc-->>ctrl: reservation
    deactivate rsc
    ctrl-->>Clerk: reservationDetails
    deactivate ctrl

    Note over Clerk,g: [2] processCheckIn(reservationId, roomId)
    Clerk->>ctrl: processCheckIn(reservationId, roomId)
    activate ctrl

    ctrl->>rsc: getReservation(reservationId)
    activate rsc
    rsc-->>ctrl: reservation
    deactivate rsc

    ctrl->>rmc: getRoom(roomId)
    activate rmc
    Note right of rmc: GRASP: Information Expert<br>+ Pure Fabrication
    rmc-->>ctrl: room
    deactivate rmc

    ctrl->>res: assignRoom(room)
    activate res
    Note right of res: GRASP: Information Expert<br>(Reservation records its own<br>checkInTimestamp and room association)
    res->>res: setCheckInTimestamp(now)
    res-->>ctrl: ok
    deactivate res

    ctrl->>r: setStatus(occupied)
    activate r
    Note right of r: GRASP: Information Expert<br>(Room manages its own status)
    r-->>ctrl: ok
    deactivate r

    ctrl->>res: getGuest()
    activate res
    res-->>ctrl: guest
    deactivate res

    ctrl->>g: setCheckedIn(true)
    activate g
    Note right of g: GRASP: Information Expert<br>(Guest manages its own state)
    g-->>ctrl: ok
    deactivate g

    ctrl-->>Clerk: checkInConfirmation
    deactivate ctrl
```

---

## Guest Registration & Authentication

| Use Case Name | Guest Registration & Authentication |
|---------------|-----------------|
| Actor         | Guest           |
| Author        | Erick Martinez  |
| Preconditions | 1. The guest has access to the hotel system portal <br>2. The guest is not currently logged into an existing account |
| Postconditions | 1. A new guest profile is created in the database <br>2. Payment information is securely tokenized/stored <br>3. The guest is automatically logged in and redirected to the dashboard <br>4. A "Welcome [Name]" message is displayed |
| Main Success Scenario | 1. The guest selects the "Register" or "Create Account" option <br>2. The guest enters personal details: Full Name, Address, Email, and Password <br>3. The guest enters payment details: Credit Card Number, Expiration Date, and CVV <br>4. The system validates the format of all fields (e.g., email syntax, credit card) <br>5. The system checks if the email address is already registered <br>6. The system encrypts the password and stores the guest profile <br>7. The system authenticates the new session <br>8. The system displays a "Welcome [Guest Name]" message on the homepage/dashboard |
| Extensions | [4]a. **Invalid Data Format**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 The system highlights the specific field (e.g., "Invalid Credit Card Format")<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 The guest corrects the data<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a3 Continue from step 4<br>[5]a. **Email Already Exists**<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a1 The system notifies the guest that an account already exists with that email<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a2 The system offers a "Forgot Password" or "Login" link<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a3 Use case ends<br>[7]a. **Authentication Failure**<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a1 The system creates the account but fails the initial login<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a2 The system redirects the guest to the manual Login page |
| Special Reqs | ● PCI Compliance: Credit card data must be handled according to security standards (e.g., masking numbers in the UI)<br>● Data Integrity: The "Welcome" message must dynamically pull the FirstName attribute from the database<br>● Persistence: Guest information must remain accessible for future "Store" purchases without re-entry |

```mermaid
sequenceDiagram
    actor Guest
    participant System

    Guest->>System: registerGuest(fullName, address, email, password, paymentInfo)
    System-->>Guest: sessionConfirmation
```

### Operation Contract

| Operation | `registerGuest(fullName: String, address: String, email: String, password: String, paymentInfo: PaymentInfo)` |
|---|---|
| Cross References | Use Case: Guest Registration & Authentication |
| Preconditions | 1. Guest has access to the hotel system portal<br>2. Guest is not currently logged in<br>3. The given email address is not already registered |
| Postconditions | 1. A new Guest profile was created in the database<br>2. Guest.password was encrypted and stored<br>3. Payment information was securely tokenized and stored<br>4. A new authenticated session was created and associated with the guest |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:RegistrationHandler` | Use-case controller; receives the `registerGuest` system operation |
| **Information Expert + Pure Fabrication** | `:GuestCatalog` | Knows all registered emails; checks uniqueness before creation |
| **Creator** | `:GuestCatalog` | Records Guest instances (GRASP Creator: B records A → B creates A) |
| **Information Expert** | `guest:Guest` | Manages its own password encryption |
| **Pure Fabrication** | `:PaymentTokenizer` | Tokenizes payment info for PCI compliance; no domain counterpart |
| **Pure Fabrication** | `:SessionStore` | Creates and stores the authenticated session |

```mermaid
sequenceDiagram
    actor Guest
    participant ctrl as :RegistrationHandler
    participant gc as :GuestCatalog
    participant g as guest:Guest
    participant pt as :PaymentTokenizer
    participant ss as :SessionStore

    Guest->>ctrl: registerGuest(fullName, address, email, password, paymentInfo)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>gc: isEmailAvailable(email)
    activate gc
    Note right of gc: GRASP: Information Expert<br>(GuestCatalog knows all emails)
    gc-->>ctrl: true
    deactivate gc

    ctrl->>pt: tokenize(paymentInfo)
    activate pt
    Note right of pt: GRASP: Pure Fabrication<br>(PCI-compliant payment tokenization)
    pt-->>ctrl: paymentToken
    deactivate pt

    ctrl->>gc: createGuest(fullName, address, email, password, paymentToken)
    activate gc
    Note right of gc: GRASP: Creator<br>(GuestCatalog records Guest instances)
    gc->>g: <<create>>(fullName, address, email, password, paymentToken)
    activate g
    g->>g: encryptPassword(password)
    Note right of g: GRASP: Information Expert<br>(Guest manages its own credentials)
    gc-->>ctrl: guest
    deactivate g
    deactivate gc

    ctrl->>ss: createSession(guest)
    activate ss
    Note right of ss: GRASP: Pure Fabrication
    ss-->>ctrl: session
    deactivate ss

    ctrl-->>Guest: sessionConfirmation
    deactivate ctrl
```

---

## Make Reservation

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
