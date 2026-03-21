# Jace Yarborough — Use Cases

## Admin Login

| Use Case Name | Admin Login |
|---|---|
| Actor | Admin |
| Author | Jace Yarborough |
| Preconditions | 1. System operational<br>2. User has a valid admin account with username and password |
| Postconditions | 1. Admin is successfully logged in<br>2. Admin is redirected to admin dashboard/panel |
| Main Success Scenario | 1. Admin navigates to login page<br>2. Admin enters username<br>3. Admin enters password<br>4. Admin submits credentials<br>5. System validates input<br>6. System verifies credentials<br>7. System displays success message<br>8. Admin is brought to admin dashboard |
| Extensions | [4]a. **Invalid username format**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 System detects username doesn't meet format requirements<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 System displays error message "Invalid username or password"<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a3 System prompts user to re-enter credentials<br>[6]a. **Invalid credentials**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 System detects username or password is incorrect<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 System increments failed login attempt counter<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a3 System displays error message "Invalid username or password"<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a4 Return to step 2<br>[6]b. **Account locked**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b1 System detects account has been locked due to multiple failed attempts<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b2 System displays error message "Account locked. Contact system administrator"<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b3 Use case ends<br>[6]c. **Password expired**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]c1 System detects password has expired<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]c2 System prompts admin to reset password<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]c3 Redirect to password reset use case |
| Special Reqs | ● Password must be hashed in database<br>● Log all login attempts |

```mermaid
sequenceDiagram
    actor Admin
    participant System

    Admin->>System: loginAdmin(username, password)
    System-->>Admin: sessionConfirmation
```

### Operation Contract

| Operation | `loginAdmin(username: String, password: String)` |
|---|---|
| Cross References | Use Case: Admin Login |
| Preconditions | 1. System is operational<br>2. An admin account with the given username exists in the system |
| Postconditions | 1. An admin session was created<br>2. Admin.isLoggedIn was set to true<br>3. The login attempt was logged |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:LoginHandler` | Use-case controller; receives the `loginAdmin` system operation |
| **Information Expert + Pure Fabrication** | `:AdminCatalog` | Holds all Admin accounts; finds by username and verifies credentials |
| **Information Expert** | `admin:Admin` | Manages its own `isLoggedIn` flag |
| **Pure Fabrication** | `:SessionStore` | Creates and stores the authenticated session |
| **Pure Fabrication** | `:AuditLog` | Logs all login attempts for auditing |

```mermaid
sequenceDiagram
    actor Admin
    participant ctrl as :LoginHandler
    participant ac as :AdminCatalog
    participant a as admin:Admin
    participant ss as :SessionStore
    participant al as :AuditLog

    Admin->>ctrl: loginAdmin(username, password)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>ac: findByUsername(username)
    activate ac
    Note right of ac: GRASP: Information Expert<br>+ Pure Fabrication
    ac-->>ctrl: admin
    deactivate ac

    ctrl->>a: verifyPassword(password)
    activate a
    Note right of a: GRASP: Information Expert<br>(Admin verifies its own credentials)
    a-->>ctrl: true
    deactivate a

    ctrl->>a: setLoggedIn(true)
    activate a
    a-->>ctrl: ok
    deactivate a

    ctrl->>ss: createSession(admin)
    activate ss
    Note right of ss: GRASP: Pure Fabrication
    ss-->>ctrl: session
    deactivate ss

    ctrl->>al: logLoginAttempt(username, success)
    activate al
    Note right of al: GRASP: Pure Fabrication
    al-->>ctrl: ok
    deactivate al

    ctrl-->>Admin: sessionConfirmation
    deactivate ctrl
```

---

## Add Room

| Use Case Name | Add Room |
|---|---|
| Actor | Hotel Clerk |
| Author | Jace Yarborough |
| Preconditions | 1. System operational<br>2. Hotel clerk is logged in |
| Postconditions | 1. New room is added to hotel inventory<br>2. Room is available for reservations |
| Main Success Scenario | 1. Hotel clerk navigates to room management page<br>2. Hotel clerk selects "Add New Room"<br>3. System displays room entry form<br>4. Hotel clerk enters room details:<br>&nbsp;&nbsp;&nbsp;&nbsp;- Room number<br>&nbsp;&nbsp;&nbsp;&nbsp;- Floor/theme (Nature Retreat, Urban Elegance, Vintage Charm)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Room type (single, double, family, suite, deluxe, standard)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Bed type and quantity (twin, full, queen, king)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Smoking/non-smoking status<br>&nbsp;&nbsp;&nbsp;&nbsp;- Quality level (executive, business, comfort, economy)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Maximum daily rate<br>5. Hotel clerk submits form<br>6. System validates all fields<br>7. System verifies room number is unique<br>8. System saves room to database<br>9. System displays success message<br>10. Hotel clerk returns to room management page |
| Extensions | [6]a. **Required fields missing**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 System highlights missing fields<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 System displays error "Please fill in all required fields"<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a3 Return to step 4<br>[6]b. **Invalid data format**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b1 System displays error "Invalid format for [field name]"<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b2 Return to step 4<br>[7]a. **Duplicate room number**<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a1 System displays error "Room number already exists"<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a2 Return to step 4<br>[8]a. **Database error**<br>&nbsp;&nbsp;&nbsp;&nbsp;[8]a1 System displays error "Unable to add room. Try again"<br>&nbsp;&nbsp;&nbsp;&nbsp;[8]a2 Use case ends |
| Special Reqs | ● Room numbers must follow hotel numbering convention<br>● Maximum daily rate must be positive value<br>● All room additions must be logged |

```mermaid
sequenceDiagram
    actor Clerk
    participant System

    Clerk->>System: addRoom(roomNumber, theme, roomType, bedType, smokingStatus, qualityLevel, maxDailyRate)
    System-->>Clerk: roomAdditionConfirmation
```

### Operation Contract

| Operation | `addRoom(roomNumber: String, theme: String, roomType: String, bedType: String, smokingStatus: Boolean, qualityLevel: String, maxDailyRate: Decimal)` |
|---|---|
| Cross References | Use Case: Add Room |
| Preconditions | 1. Hotel clerk is logged in<br>2. System is operational |
| Postconditions | 1. A new Room instance was created and saved to the database<br>2. Room was associated with the hotel inventory<br>3. Room.status was set to 'available'<br>4. The room addition was logged |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:RoomManagementHandler` | Use-case controller; receives the `addRoom` system operation |
| **Information Expert** | `:RoomCatalog` | Knows all existing room numbers; can check uniqueness before creation |
| **Creator** | `:RoomCatalog` | Records Room instances (GRASP Creator: B records A → B creates A); creates the new Room |
| **Information Expert** | `room:Room` | Initializes and manages its own `status` attribute upon creation |
| **Pure Fabrication** | `:AuditLog` | Records all room additions for the audit trail; no direct domain counterpart |

```mermaid
sequenceDiagram
    actor Clerk
    participant ctrl as :RoomManagementHandler
    participant rc as :RoomCatalog
    participant r as room:Room
    participant al as :AuditLog

    Clerk->>ctrl: addRoom(roomNumber, theme, roomType, bedType, smokingStatus, qualityLevel, maxDailyRate)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>rc: isRoomNumberUnique(roomNumber)
    activate rc
    Note right of rc: GRASP: Information Expert<br>(RoomCatalog knows all existing<br>room numbers)
    rc-->>ctrl: true
    deactivate rc

    ctrl->>rc: createRoom(roomNumber, theme, roomType, bedType, smokingStatus, qualityLevel, maxDailyRate)
    activate rc
    Note right of rc: GRASP: Creator<br>(RoomCatalog records Room instances)
    rc->>r: <<create>>(roomNumber, theme, roomType, bedType, smokingStatus, qualityLevel, maxDailyRate)
    activate r
    r->>r: setStatus(available)
    Note right of r: GRASP: Information Expert<br>(Room initializes its own status)
    rc-->>ctrl: room
    deactivate r
    deactivate rc

    ctrl->>al: logRoomAddition(room, clerkId)
    activate al
    Note right of al: GRASP: Pure Fabrication<br>(audit trail for room additions)
    al-->>ctrl: ok
    deactivate al

    ctrl-->>Clerk: roomAdditionConfirmation
    deactivate ctrl
```

---

## Create Hotel Clerk Account

| Use Case Name | Create Hotel Clerk Account |
|---------------|----------------------------|
| Actor         | Admin                      |
| Author        | Jace Yarborough            |
| Preconditions | 1. Hotel system online and operational <br>2. User is logged in as an Admin|
| Postconditions | 1. A new hotel clerk account is created <br> 2. Clerk account has given username and default password (or custom password)|
| Main Success Scenario | 1. Admin selects option to create hotel clerk account <br>2. System prompts admin to enter desired username and shows prefilled password for account.<br>3. Admin enters username and optional different password<br>4. System validates input <br> 5. System creates clerk account<br> 6. System displays success message for created account |
| Extensions | [4]a. **Username already in use**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 System detects username already in use(Ex: John_Smith)<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 System displays error message and potential username replacement (EX: John_Smith1)<br>[5]a. **Failure to create account**<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a1 Display error message of account creation failure<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a2 Reprompt user to try creating account again.|
| Special Reqs | ● Create account in timely manner<br>● Keep log of created accounts<br> ● Keep log of which admin created account|

```mermaid
sequenceDiagram
    actor Admin
    participant System

    Admin->>System: createClerkAccount(username, password)
    System-->>Admin: accountCreationConfirmation
```

### Operation Contract

| Operation | `createClerkAccount(username: String, password: String)` |
|---|---|
| Cross References | Use Case: Create Hotel Clerk Account |
| Preconditions | 1. Admin is logged in<br>2. The given username does not already exist in the system |
| Postconditions | 1. A new HotelClerk account was created<br>2. HotelClerk.username was set<br>3. HotelClerk.password was encrypted and stored<br>4. Account creation was logged with the creating admin's identity |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:CreateClerkAccountHandler` | Use-case controller; receives the `createClerkAccount` system operation |
| **Information Expert + Pure Fabrication** | `:ClerkCatalog` | Knows all existing usernames; checks uniqueness before creation |
| **Creator** | `:ClerkCatalog` | Records HotelClerk instances (GRASP Creator: B records A → B creates A) |
| **Information Expert** | `clerk:HotelClerk` | Manages its own password encryption |
| **Pure Fabrication** | `:AuditLog` | Logs account creation with the admin's identity |

```mermaid
sequenceDiagram
    actor Admin
    participant ctrl as :CreateClerkAccountHandler
    participant cc as :ClerkCatalog
    participant c as clerk:HotelClerk
    participant al as :AuditLog

    Admin->>ctrl: createClerkAccount(username, password)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>cc: isUsernameAvailable(username)
    activate cc
    Note right of cc: GRASP: Information Expert<br>(ClerkCatalog knows all usernames)
    cc-->>ctrl: true
    deactivate cc

    ctrl->>cc: createClerk(username, password)
    activate cc
    Note right of cc: GRASP: Creator<br>(ClerkCatalog records HotelClerk instances)
    cc->>c: <<create>>(username, password)
    activate c
    c->>c: encryptPassword(password)
    Note right of c: GRASP: Information Expert<br>(HotelClerk manages its own credentials)
    cc-->>ctrl: clerk
    deactivate c
    deactivate cc

    ctrl->>al: logAccountCreation(clerk, adminId)
    activate al
    Note right of al: GRASP: Pure Fabrication
    al-->>ctrl: ok
    deactivate al

    ctrl-->>Admin: accountCreationConfirmation
    deactivate ctrl
```
