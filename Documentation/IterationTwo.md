# Status
Current implementation status: Complete
Major roadblocks: None


# Screenshots

## Use Case: Admin Login

Author: Jace Yarborough
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Admin Login](../screenshots/login-page.png)

---

## Use Case: Create Hotel Clerk Account

Author: Jace Yarborough
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Create Hotel Clerk Account](Wireframes/dashboard.png)

---

## Use Case: Hotel Clerk Login

Author: Jonathan Deiss
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Hotel Clerk Login](../screenshots/login-page.png)

---

## Use Case: Hotel Clerk Add Room

Author: Jace Yarborough
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Hotel Clerk Add Room](../screenshots/add-room.png)

---

## Use Case: Room Inventory & Theme Management

Author: Jonathan Deiss
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Room Inventory & Theme Management](Wireframes/hotel-system.png)

---

## Use Case: Guest Registration & Authentication

Author: Erick Martinez
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Guest Registration & Authentication](Wireframes/registration.png)

---

## Use Case: Search Available Room

Author: James Bagwell
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Search Available Room](../screenshots/reservation-page.png)

---

## Use Case: Make Reservation

Author: Erick Martinez
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Make Reservation](../screenshots/reservation-page.png)

---

## Use Case: Cancel Reservation

Author: Zain Altaf
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Cancel Reservation](../screenshots/reservation-page.png)

---

## Use Case: Modify Reservation

Author: Zain Altaf
Connected to Backend: NO
Implemented By: Team effort prompt engineering

Screenshot: ![Modify Reservation](Wireframes/make-reservation.png)

---

## Use Case: Process Check-In

Author: Erick Martinez
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Process Check-In](Wireframes/clerk-check-in.png)

---

## Use Case: Process Check-Out

Author: Aaron
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Process Check-Out](Wireframes/clerk-check-in.png)

---

## Use Case: Generate Combined Bill

Author: Zain Altaf
Connected to Backend: NO
Implemented By: Team effort prompt engineering

Screenshot: ![Generate Combined Bill](Wireframes/dashboard.png)

---

## Use Case: Browse Product Catalog

Author: Jonathan Deiss
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Browse Product Catalog](Wireframes/hotel-system.png)

---

## Use Case: Purchase from Store

Author: Aaron
Connected to Backend: YES
Implemented By: Team effort prompt engineering

Screenshot: ![Purchase from Store](Wireframes/hotel-system.png)

---

## Use Case: View or Request Bill

Author: Aaron
Connected to Backend: NO
Implemented By: Team effort prompt engineering

Screenshot: ![View or Request Bill](Wireframes/dashboard.png)

---

## Use Case: Leave / View a Review

Author: James Bagwell
Connected to Backend: NO
Implemented By: Team effort prompt engineering

Screenshot: ![Leave / View a Review](Wireframes/hotel-system.png)

---

## Use Case: Help & Destinations

Author: James Bagwell
Connected to Backend: NO
Implemented By: Team effort prompt engineering

Screenshot: ![Help & Destinations](Wireframes/hotel-system.png)

# Design Class Diagram

```mermaid
classDiagram

%% ─── Enumerations ───────────────────────────────────────────────────────────

class UserRole {
    <<enumeration>>
    GUEST
    CLERK
    ADMIN
}

class RoomStatus {
    <<enumeration>>
    AVAILABLE
    OCCUPIED
    MAINTENANCE
}

class ReservationStatus {
    <<enumeration>>
    CONFIRMED
    CANCELLED
    CHECKED_IN
    CHECKED_OUT
}

%% ─── DTOs ────────────────────────────────────────────────────────────────────

class LoginRequest {
    <<record>>
    +String username
    +String password
}

class RegisterRequest {
    <<record>>
    +String username
    +String password
    +String name
    +String email
    +String address
    +String creditCardNumber
    +String creditCardExpiry
}

class AuthResponse {
    <<record>>
    +String token
    +UserResponse user
}

class UserResponse {
    <<record>>
    +int id
    +String username
    +String name
    +String email
    +String role
}

class RoomDto {
    <<record>>
    +int id
    +String roomNumber
    +int floor
    +String roomType
    +String qualityLevel
    +String bedType
    +int numBeds
    +boolean smoking
    +double dailyRate
    +String status
}

class ReservationRequest {
    <<record>>
    +int roomId
    +String checkInDate
    +String checkOutDate
    +String rateType
}

class ReservationDto {
    <<record>>
    +int id
    +int userId
    +int roomId
    +String roomNumber
    +String checkInDate
    +String checkOutDate
    +double rate
    +String rateType
    +String status
    +double cancellationFee
}

class ProductDto {
    <<record>>
    +int id
    +String name
    +String category
    +double price
    +int stockQuantity
    +String description
}

class CartItemRequest {
    <<record>>
    +int productId
    +int quantity
}

class BillDto {
    <<record>>
    +int id
    +int userId
    +Integer reservationId
    +Integer orderId
    +double totalAmount
    +boolean paid
}

%% ─── Controllers ─────────────────────────────────────────────────────────────

class AuthController {
    -IAuthService authService
    +register(RegisterRequest) ResponseEntity
    +login(LoginRequest) ResponseEntity
    +logout(String) ResponseEntity
    +me(String) ResponseEntity
}

class AdminController {
    -IAdminService adminService
    -IAuthService authService
    +createClerk(String, Map) ResponseEntity
    +resetPassword(String, Map) ResponseEntity
    +getAllUsers(String) ResponseEntity
}

class RoomController {
    -IRoomService roomService
    -IAuthService authService
    +getAllRooms() ResponseEntity
    +getAvailableRooms(String, String) ResponseEntity
    +getRoom(int) ResponseEntity
    +createRoom(String, RoomDto) ResponseEntity
    +updateRoom(String, int, RoomDto) ResponseEntity
}

class ReservationController {
    -IReservationService reservationService
    -IAuthService authService
    +getReservations(String) ResponseEntity
    +createReservation(String, ReservationRequest) ResponseEntity
    +cancelReservation(String, int) ResponseEntity
    +checkIn(String, int) ResponseEntity
    +checkOut(String, int) ResponseEntity
}

class StoreController {
    -IStoreService storeService
    -IAuthService authService
    +getProducts() ResponseEntity
    +getCart(String) ResponseEntity
    +addToCart(String, CartItemRequest) ResponseEntity
    +checkout(String) ResponseEntity
}

%% ─── Service Interfaces ──────────────────────────────────────────────────────

class IAuthService {
    <<interface>>
    +register(RegisterRequest) AuthResponse
    +login(LoginRequest) AuthResponse
    +logout(String) void
    +getUserFromToken(String) UsersRecord
}

class IAdminService {
    <<interface>>
    +createClerk(String, String) Map
    +resetPassword(String, String) Map
    +getAllUsers() List
}

class IRoomService {
    <<interface>>
    +getAllRooms() List~RoomDto~
    +getAvailableRooms(String, String) List~RoomDto~
    +getRoom(int) RoomDto
    +createRoom(RoomDto) RoomDto
    +updateRoom(int, RoomDto) RoomDto
}

class IReservationService {
    <<interface>>
    +getAllReservations() List~ReservationDto~
    +getReservationsForUser(int) List~ReservationDto~
    +createReservation(int, ReservationRequest) ReservationDto
    +cancelReservation(int, int, String) ReservationDto
    +checkIn(int) ReservationDto
    +checkOut(int) ReservationDto
}

class IStoreService {
    <<interface>>
    +getAllProducts() List~ProductDto~
    +getCart(int) List
    +addToCart(int, CartItemRequest) Map
    +checkout(int) Map
}

%% ─── Service Implementations ─────────────────────────────────────────────────

class AuthService {
    -UserRepository userRepository
    -BCryptPasswordEncoder passwordEncoder
    -ConcurrentHashMap~String,Integer~ sessions
    +register(RegisterRequest) AuthResponse
    +login(LoginRequest) AuthResponse
    +logout(String) void
    +getUserFromToken(String) UsersRecord
}

class AdminService {
    -UserRepository userRepository
    -BCryptPasswordEncoder passwordEncoder
    +createClerk(String, String) Map
    +resetPassword(String, String) Map
    +getAllUsers() List
}

class RoomService {
    -RoomRepository roomRepository
    +getAllRooms() List~RoomDto~
    +getAvailableRooms(String, String) List~RoomDto~
    +getRoom(int) RoomDto
    +createRoom(RoomDto) RoomDto
    +updateRoom(int, RoomDto) RoomDto
}

class ReservationService {
    -ReservationRepository reservationRepository
    -RoomRepository roomRepository
    +getAllReservations() List~ReservationDto~
    +getReservationsForUser(int) List~ReservationDto~
    +createReservation(int, ReservationRequest) ReservationDto
    +cancelReservation(int, int, String) ReservationDto
    +checkIn(int) ReservationDto
    +checkOut(int) ReservationDto
}

class StoreService {
    -ProductRepository productRepository
    -OrderRepository orderRepository
    -ReservationRepository reservationRepository
    +getAllProducts() List~ProductDto~
    +getCart(int) List
    +addToCart(int, CartItemRequest) Map
    +checkout(int) Map
}

%% ─── Repository Interfaces ───────────────────────────────────────────────────

class UserRepository {
    <<interface>>
    +existsByUsername(String) boolean
    +findByUsername(String) UsersRecord
    +findById(int) UsersRecord
    +insertGuest(RegisterRequest, String) UsersRecord
    +insertClerk(String, String, String) void
    +updatePasswordHash(String, String) int
    +findAllSummary() List
}

class RoomRepository {
    <<interface>>
    +findAll() List~RoomsRecord~
    +findAvailableBetween(LocalDate, LocalDate) List~RoomsRecord~
    +findById(int) RoomsRecord
    +insert(RoomDto) RoomsRecord
    +update(int, RoomDto) void
    +findDailyRateById(int) Float
    +updateStatus(int, String) void
}

class ReservationRepository {
    <<interface>>
    +hasConflict(int, LocalDate, LocalDate) boolean
    +findAll() List~Record~
    +findByUserId(int) List~Record~
    +findById(int) ReservationsRecord
    +insert(int, ReservationRequest, float) int
    +updateStatus(int, String) void
    +updateToCheckedIn(int) void
    +updateCancellation(int, float, LocalDateTime) void
    +findRoomIdById(int) Integer
}

class ProductRepository {
    <<interface>>
    +findAll() List~ProductsRecord~
    +findStockById(int) Integer
    +findPriceById(int) Float
    +decrementStock(int, int) void
}

class OrderRepository {
    <<interface>>
    +findCartIdByUserId(int) Integer
    +insertCart(int) int
    +insertOrderItem(int, int, int, Float) void
    +findCartItemsByUserId(int) List
    +calculateCartTotal(int) Double
    +markPurchased(int, LocalDateTime) void
    +insertBill(int, int, float) int
    +getItemsForOrder(int) List~int[]~
}

%% ─── Repository Implementations (jOOQ) ──────────────────────────────────────

class JooqUserRepository {
    -DSLContext db
}

class JooqRoomRepository {
    -DSLContext db
}

class JooqReservationRepository {
    -DSLContext db
}

class JooqProductRepository {
    -DSLContext db
}

class JooqOrderRepository {
    -DSLContext db
}

%% ─── Controller → Service dependencies ──────────────────────────────────────

AuthController --> IAuthService
AdminController --> IAdminService
AdminController --> IAuthService
RoomController --> IRoomService
RoomController --> IAuthService
ReservationController --> IReservationService
ReservationController --> IAuthService
StoreController --> IStoreService
StoreController --> IAuthService

%% ─── Service implementations ─────────────────────────────────────────────────

IAuthService <|.. AuthService
IAdminService <|.. AdminService
IRoomService <|.. RoomService
IReservationService <|.. ReservationService
IStoreService <|.. StoreService

%% ─── Service → Repository dependencies ──────────────────────────────────────

AuthService --> UserRepository
AdminService --> UserRepository
RoomService --> RoomRepository
ReservationService --> ReservationRepository
ReservationService --> RoomRepository
StoreService --> ProductRepository
StoreService --> OrderRepository
StoreService --> ReservationRepository

%% ─── Repository implementations ──────────────────────────────────────────────

UserRepository <|.. JooqUserRepository
RoomRepository <|.. JooqRoomRepository
ReservationRepository <|.. JooqReservationRepository
ProductRepository <|.. JooqProductRepository
OrderRepository <|.. JooqOrderRepository

%% ─── DTO usage ───────────────────────────────────────────────────────────────

AuthController ..> LoginRequest
AuthController ..> RegisterRequest
AuthController ..> AuthResponse
AuthResponse --> UserResponse
RoomController ..> RoomDto
ReservationController ..> ReservationRequest
ReservationController ..> ReservationDto
StoreController ..> CartItemRequest
StoreController ..> ProductDto
```

# Prompt Engineering Summary

Since we have kept our documentation all in-repo using markdown files and built our diagrams with mermaid (textual form that an LLM can understand), we could easily prompt engineer. First we created a claude code instance to create an initial "rough draft:"

```
Read through our documentation in @Documentation and begin implementing. From a technology standpoint, use:
- jOOQ
- Spring
- Frontend with react and bun as the bundler
```

This looks simple and naive but the @Documentation directive gave the agent all documentation we had made up to this point, so it had the context needed to implement everything properly. This allowed the agent to create a working MVP, but it did not do good software design practices.

We provided it with a large document on software design, which is currently stored in our repo at `prompts/software-design.md`. This file was made by giving a prompt to another agent with most of your slides and asking it to summarize good software design in the context of our technologies. We told the agent to read this guide and create a plan for refactoring and testing. This plan is stored in our repo at `prompts/software-engineering-plan.md`.


After that, we needed to improve the frontend code. We used a tool called stitch to create custom context that the agent could use to improve our frontend. We gave this context (stored in `Documentation/stitch_project_requirements_document`) to the agent and it correctly implemented our designs.


---

# Domain Model

```mermaid
classDiagram
    class Person {
        String fullName
        String address
        String email
    }

    class Guest {
    }

    class Admin {
    }

    class HotelClerk {
    }

    Person --|> Guest
    Person --|> Admin
    Person --|> HotelClerk

    class PaymentInfo {
        String cardNumber
        Date expirationDate
        String cvv
    }

    class Room {
        int roomNumber
        int floor
        String theme
        String bedType
        String qualityLevel
        float maxDailyRate
        float promotionRate
        String status
    }

    class Reservation {
        String confirmationNumber
        Date checkInDate
        Date checkOutDate
        String rateType
        float totalCost
        String status
        DateTime checkInTimestamp
    }

    class Product {
        String name
        String description
        float price
        String category
    }

    class Review {
        int starRating
        String reviewText
        Date datePosted
    }

    class HelpRequest {
        String requestType
        String description
        String status
        DateTime scheduledTime
    }

    class Corporation {
        String name
    }

    class Staff {
        String name
        String role
    }

    Guest "1" -- "1" PaymentInfo : has
    Guest "1" -- "*" Reservation : makes
    Guest "1" -- "*" Review : writes
    Guest "1" -- "*" HelpRequest : submits
    Reservation "*" -- "1" Room : reserves
    Reservation "*" -- "0..1" Corporation : billedTo
    Admin "1" -- "*" HotelClerk : creates
    HotelClerk "1" -- "*" Reservation : processesCheckIn
    HelpRequest "*" -- "0..1" Staff : assignedTo
```


---

# Use Case Diagram

```mermaid
graph LR
    Admin((Admin))
    Clerk((Hotel Clerk))
    Guest((Guest))
    PrevGuest((Previous Guest))

    subgraph Hotel Management System
        AdminLogin([Admin Login])
        CreateClerkAccount([Create Hotel Clerk Account])

        AddRoom([Add Room])
        RoomThemeManagement([Room Inventory & Theme Management])
        ProcessCheckIn([Process Check-In])
        ProcessCheckOut([Process Check-Out])
        GenerateCombinedBill([Generate Combined Bill])

        GuestAuth([Guest Registration & Authentication])
        SearchRoom([Search Available Room])
        MakeReservation([Make Reservation])
        CancelReservation([Cancel Reservation])
        ModifyReservation([Modify Reservation])
        BrowseCatalog([Browse Product Catalog])
        PurchaseFromStore([Purchase from Store])
        HelpDestinations([Help & Destinations])

        ViewBill([View or Request Bill])
        Review([Leave / View a Review])
    end

    Admin --> AdminLogin
    Admin --> CreateClerkAccount

    Clerk --> AddRoom
    Clerk --> RoomThemeManagement
    Clerk --> ProcessCheckIn
    Clerk --> ProcessCheckOut
    Clerk --> GenerateCombinedBill
    Clerk --> ViewBill

    Guest --> GuestAuth
    Guest --> SearchRoom
    Guest --> MakeReservation
    Guest --> CancelReservation
    Guest --> ModifyReservation
    Guest --> BrowseCatalog
    Guest --> PurchaseFromStore
    Guest --> HelpDestinations
    Guest --> ViewBill
    Guest --> Review

    PrevGuest --> Review
```


---

# Use Cases

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



## Cancel Reservation

| Use Case Name| Cancel Reservation |
|---------------|-----------------|
| Actor         | Hotel Guest    |
| Author        | Zain Altaf     |
| Preconditions | 1. The hotel guest is logged into the system. <br>2. The guest has an existing reservation.|
|Postconditions | 1. The reservation is canceled only if cancellation is permitted. <br> 2. If cancellation is permitted, any applicable cancellation penalty is recorded. <br> 3.If cancellation is not permitted, the reservation remains unchanged.|
|Main Success Scenario| 1. The guest selects the option to view reservations. <br>2. The system displays the guest’s reservations.<br>3. The guest selects a reservation to cancel. <br>4. The system checks the time remaining until the reservation’s check-in date. <br> 5. The system determines that the cancellation request is more than the required time. <br> 6. The system displays the applicable cancellation policy and any penalty(if required). <br> 7. The guest confirms the cancellation. <br> 8.The system cancels the reservation. <br> 9. The system displays a cancellation confirmation message.|
|Extensions| [4]a. **Cancellation not allowed (within a specific time frame)**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 The system determines that the cancellation request is within x hours of the check-in time.<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 The system displays a message explaining that cancellation is not permitted according to the policy.<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a3 The reservation remains unchanged.|
|Special Reqs| ● The system must enforce the X-hour cancellation policy exactly.<br>● Time comparisons must use the hotel's local time zone. <br> ● All cancellation attempts must be logged for auditing and billing purposes.|

```mermaid
sequenceDiagram
    actor Guest
    participant System

    Guest->>System: getReservations()
    System-->>Guest: reservationList
    Guest->>System: cancelReservation(reservationId)
    System-->>Guest: cancellationConfirmation
```

### Operation Contract

| Operation | `cancelReservation(reservationId: String)` |
|---|---|
| Cross References | Use Case: Cancel Reservation |
| Preconditions | 1. Guest is logged in<br>2. Reservation exists and is associated with the guest<br>3. The cancellation request is more than X hours before the check-in time |
| Postconditions | 1. Reservation.status was set to 'cancelled'<br>2. Any applicable cancellation penalty was recorded and associated with the reservation<br>3. The cancellation attempt was logged for auditing |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:CancelReservationHandler` | Use-case controller; handles both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:ReservationCatalog` | Holds all Reservation data; retrieves reservations by guest and by ID |
| **Information Expert** | `reservation:Reservation` | Has `checkInDate` — enforces the X-hour cancellation policy; sets its own status and records the penalty |
| **Pure Fabrication** | `:AuditLog` | Logs all cancellation attempts for auditing |

```mermaid
sequenceDiagram
    actor Guest
    participant ctrl as :CancelReservationHandler
    participant rcat as :ReservationCatalog
    participant res as reservation:Reservation
    participant al as :AuditLog

    Note over Guest,rcat: [1] getReservations()
    Guest->>ctrl: getReservations()
    activate ctrl
    Note right of ctrl: GRASP: Controller
    ctrl->>rcat: getByGuest(guestId)
    activate rcat
    Note right of rcat: GRASP: Information Expert<br>+ Pure Fabrication
    rcat-->>ctrl: reservationList
    deactivate rcat
    ctrl-->>Guest: reservationList
    deactivate ctrl

    Note over Guest,al: [2] cancelReservation(reservationId)
    Guest->>ctrl: cancelReservation(reservationId)
    activate ctrl

    ctrl->>rcat: getReservation(reservationId)
    activate rcat
    rcat-->>ctrl: reservation
    deactivate rcat

    ctrl->>res: isCancellable()
    activate res
    Note right of res: GRASP: Information Expert
    res-->>ctrl: canCancel
    deactivate res

    alt cancellation allowed
        ctrl->>res: cancel()
        activate res
        Note right of res: GRASP: Information Expert
        res->>res: setStatus(cancelled)
        res->>res: recordPenalty()
        res-->>ctrl: ok
        deactivate res

        ctrl->>al: logCancellation(reservationId, success)
        activate al
        Note right of al: GRASP: Pure Fabrication
        al-->>ctrl: ok
        deactivate al

        ctrl-->>Guest: cancellationConfirmation
    else cancellation denied
        ctrl-->>Guest: cancellationDenied
    end

    deactivate ctrl
```



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



## Create Hotel Clerk Account

| Use Case Name | Create Hotel Clerk Account |
|---------------|----------------------------|
| Actor         | Admin                      |
| Author        | Jace Yarborough            |
| Preconditions | 1. Hotel system online and operational <br>2. User is logged in as an Admin|
|Postconditions | 1. A new hotel clerk account is created <br> 2. Clerk account has given username and default password (or custom password)|
|Main Success Scenario| 1. Admin selects option to create hotel clerk account <br>2. System prompts admin to enter desired username and shows prefilled password for account.<br>3. Admin enters username and optional different password<br>4. System validates input <br> 5. System creates clerk account<br> 6. System displays success message for created account |
|Extensions| [4]a. **Username already in use**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 System detects username already in use(Ex: John_Smith)<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 System displays error message and potential username replacement (EX: John_Smith1)<br>[5]a. **Failure to create account**<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a1 Display error message of account creation failure<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a2 Reprompt user to try creating account again.|
|Special Reqs| ● Create account in timely manner<br>● Keep log of created accounts<br> ● Keep log of which admin created account|

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



## Generate Combined Bill

| Use Case Name | Generate Combined Bill |
|---------------|------------------------|
| Actor         | Hotel Clerk            |
| Author        | Zain Altaf             |
| Preconditions | 1. The hotel clerk is logged into the system. <br>2. The guest has completed check-out. <br>3. The guest has at least one reservation recorded in the system. |
| Postconditions | 1. A combined bill is generated for the guest. <br>2. The bill includes all room charges and store purchases. <br>3. The finalized bill is stored in the system. |
| Main Success Scenario | 1. The clerk selects a checked-out guest. <br>2. The system retrieves the guest’s reservation details. <br>3. The system retrieves all store purchases made during the guest’s stay. <br>4. The system calculates the total room charges. <br>5. The system calculates the total store charges. <br>6. The system applies any taxes or additional fees. <br>7. The system combines all charges into a single bill. <br>8. The system displays the bill summary. <br>9. The clerk reviews and confirms the bill. <br>10. The system finalizes and stores the bill. |
| Extensions | [3]a. **No store purchases recorded**<br>&nbsp;&nbsp;&nbsp;&nbsp;[3]a1 The system generates a bill including only room charges.<br>[2]b. **Corporate guest billing**<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]b1 The system marks the bill as corporate billing.<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]b2 The payment status is set to pending. |
| Special Reqs | ● Bill calculations must be accurate and consistent with reservation and purchase records.<br>● Tax calculations must follow applicable hotel policies.<br>● The generated bill must be stored for auditing and reporting purposes. |

```mermaid
sequenceDiagram
    actor Clerk
    participant System

    Clerk->>System: generateCombinedBill(guestId)
    System-->>Clerk: combinedBill
```

### Operation Contract

| Operation | `generateCombinedBill(guestId: String)` |
|---|---|
| Cross References | Use Case: Generate Combined Bill |
| Preconditions | 1. Hotel clerk is logged in<br>2. Guest has completed check-out<br>3. At least one reservation is recorded for the guest |
| Postconditions | 1. A combined Bill was created and associated with the guest<br>2. Bill included all room charges from the guest's stay<br>3. Bill included all store purchase charges from the guest's stay<br>4. Applicable taxes and fees were applied to the total<br>5. Finalized bill was stored in the system for auditing |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:GenerateBillHandler` | Use-case controller; receives the `generateCombinedBill` system operation |
| **Information Expert + Pure Fabrication** | `:ReservationCatalog` | Holds all Reservation data; retrieves the guest's reservation |
| **Information Expert + Pure Fabrication** | `:PurchaseCatalog` | Holds all store purchase records for a guest's stay |
| **Information Expert** | `reservation:Reservation` | Knows its own room charges (rate, dates, totalCost) |
| **Creator + Pure Fabrication** | `:BillCatalog` | Records Bill instances → creates Bill; stores finalized bill |
| **Information Expert** | `bill:Bill` | Aggregates all charges and applies taxes to its own total |

```mermaid
sequenceDiagram
    actor Clerk
    participant ctrl as :GenerateBillHandler
    participant rcat as :ReservationCatalog
    participant res as reservation:Reservation
    participant pc as :PurchaseCatalog
    participant bcat as :BillCatalog
    participant b as bill:Bill

    Clerk->>ctrl: generateCombinedBill(guestId)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>rcat: getByGuest(guestId)
    activate rcat
    Note right of rcat: GRASP: Information Expert<br>+ Pure Fabrication
    rcat-->>ctrl: reservation
    deactivate rcat

    ctrl->>pc: getByGuest(guestId)
    activate pc
    Note right of pc: GRASP: Information Expert<br>+ Pure Fabrication
    pc-->>ctrl: purchases
    deactivate pc

    ctrl->>bcat: createBill(reservation, purchases)
    activate bcat
    Note right of bcat: GRASP: Creator<br>(BillCatalog records Bill instances)
    bcat->>b: <<create>>(reservation, purchases)
    activate b

    b->>res: getRoomCharges()
    activate res
    Note right of res: GRASP: Information Expert<br>(Reservation knows its own room charges)
    res-->>b: roomCharges
    deactivate res

    b->>b: aggregatePurchases(purchases)
    Note right of b: GRASP: Information Expert

    b->>b: applyTaxes()
    Note right of b: GRASP: Information Expert

    bcat-->>ctrl: bill
    deactivate b
    deactivate bcat

    ctrl->>bcat: save(bill)
    activate bcat
    bcat-->>ctrl: ok
    deactivate bcat

    ctrl-->>Clerk: combinedBill
    deactivate ctrl
```



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



## HelpDesk

| Use Case Name | HelpDesk |
|---------------|----------|
| Actor         | Guest    |
| Author        | James Bagwell |
| Preconditions | 1. There is a staff member on standby to help over the computer / phone <br>2. There is a staff member ready to complete the scheduled service at the time it was scheduled |
| Postconditions | 1. Guest received help they needed <br>2. Guest schedules a service and reason for scheduling |
| Main Success Scenario | 1. User logs into the hotel website and navigates to the HelpDesk menu <br>2. If they need technical help (such as Wi-Fi not working, how to use the phone, etc.), they select that option. If they need a technician or a house-keeper (for example, if the air-conditioning isn't working or the toilet is clogged), they choose the other option. <br>3. If the user selects the first option, they are able to chat on the computer with someone who can help. If they choose the second option, they can request a technician or house-keeper to fix the situation, and the system will assign and schedule someone to come help as soon as possible. <br>4. The situation is fixed. |
| Extensions | 2a. **No Virtual Technician Available**<br>&nbsp;&nbsp;&nbsp;&nbsp;2a1. No staff member is available for technical support.<br>&nbsp;&nbsp;&nbsp;&nbsp;2a2. The system displays a message notifying the yuser of a delay and it and allows the guest to submit a request to get a call back later.<br>3b. **No Technician or House-keeper Available**<br>&nbsp;&nbsp;&nbsp;&nbsp;3b1. No technician or house-keeper is available at the requested time.<br>&nbsp;&nbsp;&nbsp;&nbsp;3b2. The system prompts the guest to select an alternate time for the service request. |
| Special Reqs | ● The HelpDesk system must always be accessible through the hotel website.<br>● Live chat must occur quickly.<br>● All help requests and service schedules must be logged and associated with the guest's room number and account / phone number. |

```mermaid
sequenceDiagram
    actor Guest
    participant System

    Guest->>System: submitHelpRequest(requestType, description)
    System-->>Guest: helpRequestConfirmation
```

### Operation Contract

| Operation | `submitHelpRequest(requestType: String, description: String)` |
|---|---|
| Cross References | Use Case: HelpDesk |
| Preconditions | 1. Guest is logged in<br>2. A staff member is on standby<br>3. Hotel system is accessible |
| Postconditions | 1. A new HelpRequest was created and associated with the guest's account and room number<br>2. If technical help: a live chat session was initiated between the guest and an available staff member<br>3. If service request: a ServiceRequest was created, a staff member was assigned, and a service time was scheduled<br>4. Help request was logged with the guest's room number and account |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:HelpDeskHandler` | Use-case controller; receives the `submitHelpRequest` system operation |
| **Creator** | `guest:Guest` | Domain model shows `Guest "1"--"*" HelpRequest : submits`; Guest aggregates HelpRequests |
| **Information Expert + Pure Fabrication** | `:StaffCatalog` | Holds all Staff data and knows who is currently available; no direct domain class |
| **Information Expert** | `helpRequest:HelpRequest` | Manages its own `status` and `scheduledTime` attributes |
| **Pure Fabrication** | `:ChatService` | Handles live chat session orchestration; no domain counterpart |
| **Pure Fabrication** | `:HelpRequestCatalog` | Records and persists all HelpRequests for auditing and lookup |

```mermaid
sequenceDiagram
    actor GuestActor as Guest
    participant ctrl as :HelpDeskHandler
    participant g as guest:Guest
    participant req as helpRequest:HelpRequest
    participant sc as :StaffCatalog
    participant cs as :ChatService
    participant hrc as :HelpRequestCatalog

    GuestActor->>ctrl: submitHelpRequest(requestType, description)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>g: createHelpRequest(requestType, description)
    activate g
    Note right of g: GRASP: Creator<br>(Guest submits HelpRequests)
    g->>req: <<create>>(requestType, description)
    activate req
    g-->>ctrl: helpRequest
    deactivate g

    ctrl->>sc: findAvailableStaff(requestType)
    activate sc
    Note right of sc: GRASP: Information Expert<br>+ Pure Fabrication
    sc-->>ctrl: staff
    deactivate sc

    alt technical support request
        ctrl->>cs: initiateChat(helpRequest, staff)
        activate cs
        Note right of cs: GRASP: Pure Fabrication<br>(manages live chat sessions)
        cs-->>ctrl: chatSession
        deactivate cs
        ctrl->>req: setStatus(inChat)
        activate req
        req-->>ctrl: ok
        deactivate req
    else service request
        ctrl->>req: scheduleService(staff)
        activate req
        Note right of req: GRASP: Information Expert<br>(HelpRequest records its own<br>scheduledTime and assigned staff)
        req-->>ctrl: ok
        deactivate req
    end

    ctrl->>hrc: add(helpRequest)
    activate hrc
    Note right of hrc: GRASP: Pure Fabrication<br>(records all HelpRequests for auditing)
    hrc-->>ctrl: ok
    deactivate hrc

    deactivate req
    ctrl-->>GuestActor: helpRequestConfirmation
    deactivate ctrl
```



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



## Modify Reservation

| Use Case Name| Modify Reservation |
|---------------|-----------------|
| Actor         | Hotel Guest    |
| Author        | Zain Altaf     |
| Preconditions | 1. The hotel guest is logged into the system. <br>2.The guest has an existing reservation. <br> 3. The reservation has not yet started.|
|Postconditions | 1. The reservation is updated only if modification is permitted. <br> 2. If modification is not permitted, the reservation remains unchanged. <br> 3. Any change in price is recalculated and recorded. |
|Main Success Scenario| 1. The guest selects the option to view their reservations. <br>2. The system displays the guest’s reservations.<br>3. The guest selects a reservation to modify.<br>4. The system displays the current reservation details <br> 5.The guest enters the requested changes (e.g., dates or room type).<br> 6. The system checks whether the modification request is more than X hours before the check-in time. <br> 7. The system checks room availability for the requested changes. <br> 8. The system recalculates the reservation cost, if applicable. <br> 9. The system displays the updated reservation details. <br> 10. The guest confirms the modification. <br> 11. The system updates the reservation. <br> 12. The system displays a modification confirmation message.|
|Extensions| [6]a. **Modification not allowed (within X hours of check-in)**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 The system determines that the modification request is within X hours of the check-in time.<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 The system displays a message explaining that modifications are not permitted according to the policy.|
|Special Reqs| ● The system must enforce the X-hour modification policy exactly.<br>● Availability checks must be consistent with current reservations.<br> ● Price recalculation must follow hotel pricing rules.|

```mermaid
sequenceDiagram
    actor Guest
    participant System

    Guest->>System: getReservations()
    System-->>Guest: reservationList
    Guest->>System: modifyReservation(reservationId, newCheckInDate, newCheckOutDate, newRoomType)
    System-->>Guest: modificationConfirmation
```

### Operation Contract

| Operation | `modifyReservation(reservationId: String, newCheckInDate: Date, newCheckOutDate: Date, newRoomType: String)` |
|---|---|
| Cross References | Use Case: Modify Reservation |
| Preconditions | 1. Guest is logged in<br>2. Reservation exists and is associated with the guest<br>3. The modification is requested more than X hours before check-in<br>4. The reservation has not yet started |
| Postconditions | 1. Reservation.checkInDate and/or Reservation.checkOutDate were updated (if changed)<br>2. Reservation was associated with the new room type (if changed)<br>3. Reservation.totalCost was recalculated and updated<br>4. Reservation.lastModified timestamp was updated |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:ModifyReservationHandler` | Use-case controller; handles both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:ReservationCatalog` | Holds all Reservation data; retrieves reservations by guest and by ID |
| **Information Expert** | `reservation:Reservation` | Has `checkInDate` — enforces the X-hour modification policy; applies its own date/room changes and recalculates `totalCost` |
| **Information Expert** | `room:Room` | Has `maxDailyRate`, `promotionRate` — provides rate data for cost recalculation |
| **Information Expert + Pure Fabrication** | `:RoomCatalog` | Checks availability for the requested room type and date range |

```mermaid
sequenceDiagram
    actor Guest
    participant ctrl as :ModifyReservationHandler
    participant rsc as :ReservationCatalog
    participant res as reservation:Reservation
    participant rmc as :RoomCatalog
    participant r as room:Room

    Note over Guest,rsc: [1] getReservations()
    Guest->>ctrl: getReservations()
    activate ctrl
    Note right of ctrl: GRASP: Controller
    ctrl->>rsc: getByGuest(guestId)
    activate rsc
    Note right of rsc: GRASP: Information Expert<br>+ Pure Fabrication
    rsc-->>ctrl: reservationList
    deactivate rsc
    ctrl-->>Guest: reservationList
    deactivate ctrl

    Note over Guest,r: [2] modifyReservation(reservationId, newCheckInDate, newCheckOutDate, newRoomType)
    Guest->>ctrl: modifyReservation(reservationId, newCheckInDate, newCheckOutDate, newRoomType)
    activate ctrl

    ctrl->>rsc: getReservation(reservationId)
    activate rsc
    rsc-->>ctrl: reservation
    deactivate rsc

    ctrl->>res: isModifiable()
    activate res
    Note right of res: GRASP: Information Expert
    res-->>ctrl: canModify
    deactivate res

    alt modification allowed
        ctrl->>rmc: getAvailableRoomByType(newCheckInDate, newCheckOutDate, newRoomType)
        activate rmc
        Note right of rmc: GRASP: Information Expert<br>+ Pure Fabrication
        rmc-->>ctrl: room
        deactivate rmc

        ctrl->>res: applyModification(newCheckInDate, newCheckOutDate, room)
        activate res
        Note right of res: GRASP: Information Expert

        res->>r: getDailyRate(rateType)
        activate r
        Note right of r: GRASP: Information Expert<br>(Room knows its rates)
        r-->>res: dailyRate
        deactivate r

        res->>res: recalculateTotalCost(dailyRate, newCheckInDate, newCheckOutDate)
        Note right of res: GRASP: Information Expert

        res->>res: updateLastModified()

        res-->>ctrl: modificationSummary
        deactivate res

        ctrl-->>Guest: modificationConfirmation
    else modification not allowed
        ctrl-->>Guest: modificationDenied
    end

    deactivate ctrl
```



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



## Process Check-Out

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



## Purchase from Store

| Use Case Name | Purchase from Store |
|---------------|-----------------|
| Actor         | Guest          |
| Author        | [Aaron]    |
| Preconditions | 1. The guest is logged into the hotel system <br>2. The guest has browsed the product catalog and identified items to purchase <br>3. The guest is checked in (or the system allows store purchases for registered guests as per policy) <br>4. Products are available in inventory |
| Postconditions | 1. The selected products are recorded as purchased and associated with the guest (and room/stay if checked in) <br>2. Inventory for purchased items is updated <br>3. Payment is recorded and the guest receives confirmation <br>4. Charges are applied to the room bill (if checked in) or paid at time of purchase |
| Main Success Scenario | 1. The guest navigates to the Store from the main dashboard <br>2. The guest adds one or more products to the cart (product, quantity, size/variant if applicable) <br>3. The guest views the cart and adjusts quantities or removes items if desired <br>4. The guest proceeds to checkout <br>5. The system displays order summary (items, quantities, prices, total) and confirms guest/room for billing <br>6. The guest confirms payment method (charge to room or enter card) <br>7. The system validates payment and inventory availability <br>8. The system records the sale and updates inventory <br>9. The system applies charges to the room bill or completes the payment transaction <br>10. The system displays order confirmation and, if applicable, delivery or pickup details <br>11. The guest acknowledges the confirmation |
| Extensions | [2]a. **Product no longer available**<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]a1 The system notifies the guest that the item is out of stock<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]a2 The guest removes the item or selects an alternative<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]a3 Continue from step 3<br>[7]a. **Payment failed**<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a1 The system displays payment error message<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a2 The guest corrects payment details or chooses another method<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a3 Return to step 6<br>[7]b. **Guest not checked in and no payment method**<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]b1 The system prompts for a valid payment method to complete purchase<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]b2 Use case ends if guest cannot provide payment |
| Special Reqs | ● Store purchases for checked-in guests must be chargeable to the room and visible on the final bill (Process Check-Out)<br>● Inventory must be decremented atomically with the sale<br>● Payment and order details must be stored securely and logged for auditing |

```mermaid
sequenceDiagram
    actor Guest
    participant System

    Guest->>System: purchaseFromStore(guestId, cartItems, paymentMethod)
    System-->>Guest: orderConfirmation
```

### Operation Contract

| Operation | `purchaseFromStore(guestId: String, cartItems: List<CartItem>, paymentMethod: PaymentMethod)` |
|---|---|
| Cross References | Use Case: Purchase from Store |
| Preconditions | 1. Guest is logged in<br>2. All items in the cart are available in inventory<br>3. Guest is checked in or has a valid payment method on file |
| Postconditions | 1. A new Sale was created and associated with the guest and current stay<br>2. Inventory quantity was decremented for each purchased item<br>3. Charges were applied to the guest's room bill (if checked in) or a payment transaction was completed<br>4. Order confirmation was generated and associated with the sale |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:PurchaseHandler` | Use-case controller; receives the `purchaseFromStore` system operation |
| **Information Expert + Pure Fabrication** | `:ProductCatalog` | Holds all Product and inventory data; validates stock and decrements quantities |
| **Creator + Pure Fabrication** | `:PurchaseCatalog` | Records Sale instances (GRASP Creator: B records A → B creates A) |
| **Information Expert** | `sale:Sale` | Calculates its own total from the cart items |
| **Pure Fabrication** | `:BillingService` | Routes charges to the room bill or processes a card payment; no domain counterpart |

```mermaid
sequenceDiagram
    actor Guest
    participant ctrl as :PurchaseHandler
    participant pcat as :ProductCatalog
    participant pucat as :PurchaseCatalog
    participant s as sale:Sale
    participant bs as :BillingService

    Guest->>ctrl: purchaseFromStore(guestId, cartItems, paymentMethod)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>pcat: validateInventory(cartItems)
    activate pcat
    Note right of pcat: GRASP: Information Expert<br>+ Pure Fabrication
    pcat-->>ctrl: available
    deactivate pcat

    ctrl->>pucat: createSale(guestId, cartItems)
    activate pucat
    Note right of pucat: GRASP: Creator<br>(PurchaseCatalog records Sale instances)
    pucat->>s: <<create>>(guestId, cartItems)
    activate s
    s->>s: calculateTotal(cartItems)
    Note right of s: GRASP: Information Expert<br>(Sale calculates its own total)
    pucat-->>ctrl: sale
    deactivate s
    deactivate pucat

    ctrl->>pcat: decrementInventory(cartItems)
    activate pcat
    Note right of pcat: GRASP: Information Expert<br>(ProductCatalog manages inventory)
    pcat-->>ctrl: ok
    deactivate pcat

    ctrl->>bs: applyCharges(sale, paymentMethod)
    activate bs
    Note right of bs: GRASP: Pure Fabrication<br>(routes to room bill or card payment)
    bs-->>ctrl: paymentConfirmation
    deactivate bs

    ctrl-->>Guest: orderConfirmation
    deactivate ctrl
```



## Leaving and / or Viewing a Review

| Use Case Name | Leaving and / or Viewing a Review |
|---------------|-----------------|
| Actor         | Previous Hotel Guest / Potential Guest |
| Author        | James Bagwell |
| Preconditions | 1. The user is on the review / details page. <br>2. To leave a review, the user must be logged into their account and theyu must have reserved AND checked-in to a room previously. |
| Postconditions | 1. The new review is saved to the database and displayed on the hotel page. <br> 2. The hotel’s average star rating is updated. |
| Main Success Scenario | 1. The User selects the "Reviews" tab on the hotel detail page. <br>2. The System displays a list of existing reviews and the current average rating. <br>3. The User clicks the button to leave a review. <br>4. The User leaves a star rating ( 1–5 ) and writes their review in the text field. <br> 5. The User clicks the submits the review. <br> 6. The System validates the review and indicates that the review was successfully left. |
| Extensions | [3]a. **User is not logged in**<br>&nbsp;&nbsp;&nbsp;&nbsp; [3]a1. The System prompts the user to log in or sign up.<br>&nbsp;&nbsp;&nbsp;&nbsp; [3]a2. Upon successful login, the system redirects the user back to the review form.<br>[5]b. **Incomplete Review Form**<br>&nbsp;&nbsp;&nbsp;&nbsp; [5]b1. The System highlights the missing fields (for example, if the star rating is left blank).<br>&nbsp;&nbsp;&nbsp;&nbsp; [5]b2. The System prevents submission until all required fields are filled.|
| Special Reqs | ● The system must filter for profanity or restricted content before publishing.<br>● The user must be able to filter how many reviews they want to see ( For example, show 10 reviews ).<br> ● Users should be able to sort reviews by "Most Recent" or "Highest Rated."|

```mermaid
sequenceDiagram
    actor User
    participant System

    User->>System: getReviews(hotelId)
    System-->>User: reviewList
    User->>System: submitReview(hotelId, starRating, reviewText)
    System-->>User: submissionConfirmation
```

### Operation Contract

| Operation | `submitReview(hotelId: String, starRating: Integer, reviewText: String)` |
|---|---|
| Cross References | Use Case: Leaving and / or Viewing a Review |
| Preconditions | 1. User is logged in<br>2. User has a prior completed stay (checked in) at the hotel |
| Postconditions | 1. A new Review was created and associated with the hotel<br>2. Review was associated with the Guest account<br>3. Hotel.averageStarRating was recalculated and updated<br>4. Review was stored in the database and made visible on the hotel page |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:ReviewHandler` | Use-case controller; handles both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:ReviewCatalog` | Holds all Review data; retrieves reviews by hotel and recalculates average rating |
| **Information Expert + Pure Fabrication** | `:GuestCatalog` | Retrieves the current guest from the active session |
| **Creator** | `guest:Guest` | Domain model shows `Guest "1"--"*" Review : writes`; Guest aggregates Reviews |

```mermaid
sequenceDiagram
    actor User
    participant ctrl as :ReviewHandler
    participant rcat as :ReviewCatalog
    participant gc as :GuestCatalog
    participant g as guest:Guest
    participant rev as review:Review

    Note over User,rcat: [1] getReviews(hotelId)
    User->>ctrl: getReviews(hotelId)
    activate ctrl
    Note right of ctrl: GRASP: Controller
    ctrl->>rcat: getByHotel(hotelId)
    activate rcat
    Note right of rcat: GRASP: Information Expert<br>+ Pure Fabrication
    rcat-->>ctrl: reviewList
    deactivate rcat
    ctrl-->>User: reviewList
    deactivate ctrl

    Note over User,rev: [2] submitReview(hotelId, starRating, reviewText)
    User->>ctrl: submitReview(hotelId, starRating, reviewText)
    activate ctrl

    ctrl->>gc: getCurrentGuest(guestId)
    activate gc
    Note right of gc: GRASP: Information Expert<br>+ Pure Fabrication
    gc-->>ctrl: guest
    deactivate gc

    ctrl->>g: writeReview(hotelId, starRating, reviewText)
    activate g
    Note right of g: GRASP: Creator<br>(Guest "1"--"*" Review : writes)
    g->>rev: <<create>>(hotelId, starRating, reviewText)
    activate rev
    g-->>ctrl: review
    deactivate g

    ctrl->>rcat: add(review)
    activate rcat
    rcat-->>ctrl: ok
    deactivate rcat

    ctrl->>rcat: updateAverageRating(hotelId)
    activate rcat
    Note right of rcat: GRASP: Information Expert<br>(ReviewCatalog knows all ratings<br>for a hotel)
    rcat-->>ctrl: ok
    deactivate rcat

    deactivate rev
    ctrl-->>User: submissionConfirmation
    deactivate ctrl
```



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



## Search Available Room

| Use Case Name | Search Available Room |
|---------------|-----------------|
| Actor         | Hotel Guest    |
| Author        | James Bagwell  |
| Preconditions | 1. The hotel system is functional and online <br>2. Room and reservation data exists in the database |
| Postconditions | 1. Available rooms are displayed to the user <br>2. Data is not modified |
| Main Success Scenario | 1. The user selects the search option <br>2. The user enters their search criteria such as check in / out date, number of guests, number of beds, bed size, etc. <br>3. System validates input <br>4. System searches for rooms that match user criteria, if available <br>5. System displays list of available rooms that match user criteria, if available |
| Extensions | |
| Special Reqs | |

```mermaid
sequenceDiagram
    actor Guest
    participant System

    Guest->>System: searchAvailableRooms(checkInDate, checkOutDate, numGuests, numBeds, bedSize)
    System-->>Guest: availableRoomList
```

### Operation Contract

| Operation | `searchAvailableRooms(checkInDate: Date, checkOutDate: Date, numGuests: Integer, numBeds: Integer, bedSize: String)` |
|---|---|
| Cross References | Use Case: Search Available Room |
| Preconditions | 1. Hotel system is functional and online<br>2. Room and reservation data exist in the database |
| Postconditions | 1. No domain model state was changed (read-only operation)<br>2. A list of rooms matching the search criteria was retrieved and displayed |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:SearchRoomHandler` | Use-case controller; receives the `searchAvailableRooms` system operation |
| **Information Expert + Pure Fabrication** | `:RoomCatalog` | Holds all Room and Reservation data; filters rooms by availability and all search criteria |

```mermaid
sequenceDiagram
    actor Guest
    participant ctrl as :SearchRoomHandler
    participant rc as :RoomCatalog

    Guest->>ctrl: searchAvailableRooms(checkInDate, checkOutDate, numGuests, numBeds, bedSize)
    activate ctrl
    Note right of ctrl: GRASP: Controller
    ctrl->>rc: getAvailableRooms(checkInDate, checkOutDate, numGuests, numBeds, bedSize)
    activate rc
    Note right of rc: GRASP: Information Expert<br>+ Pure Fabrication
    rc-->>ctrl: availableRooms
    deactivate rc
    ctrl-->>Guest: availableRoomList
    deactivate ctrl
```



## View or Request Bill

| Use Case Name | View or Request Bill |
|---------------|-----------------|
| Actor         | Hotel Guest or Hotel Clerk    |
| Author        | [Aaron]    |
| Preconditions | 1. The hotel system is functional and online <br>2. The actor is logged in to the system <br>3. There exists a stay, reservation, or set of charges associated with the guest (current or past) |
| Postconditions | 1. The actor has viewed the current bill or a historical bill for the specified stay <br>2. If requested, an invoice or receipt is generated and made available (e.g., download or email) <br>3. The request is logged for auditing where applicable |
| Main Success Scenario | 1. The guest or clerk navigates to billing, "My Stay," or reservation details <br>2. The guest selects their stay (or the clerk selects the guest and stay) <br>3. The system retrieves all charges for that stay (room, rate, taxes, minibar, store purchases, incidentals) <br>4. The system displays an itemized bill with line items, dates, and totals <br>5. The actor reviews the bill <br>6. If the actor requests an invoice or receipt, they select "Request Invoice" or "Download Receipt" <br>7. The system generates the document (PDF or formatted print) with hotel branding and bill details <br>8. The system makes the document available for download or sends it to the guest's email <br>9. The system displays confirmation that the bill was viewed and, if applicable, that the invoice was sent |
| Extensions | [2]a. **No stay or reservation found**<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]a1 The system displays a message that no billable stay was found for this guest<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]a2 Use case ends<br>[6]a. **Invoice request for past stay**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 The system allows invoice generation for completed stays within the retention period<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 Continue from step 7<br>[6]b. **Invoice request not allowed (e.g., stay in progress and policy requires check-out first)**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b1 The system displays "Final invoice available at check-out" or similar<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b2 Use case ends with bill view only |
| Special Reqs | ● Bill must reflect all charges from room, store (Purchase from Store), and incidentals in real time<br>● Invoice/receipt must include all legally required information (hotel name, stay dates, tax breakdown, etc.)<br>● Guest may only view or request bills for their own stays; clerks may view bills for any guest as authorized |

```mermaid
sequenceDiagram
    actor GuestOrClerk
    participant System

    GuestOrClerk->>System: viewBill(stayId)
    System-->>GuestOrClerk: itemizedBill
    GuestOrClerk->>System: requestInvoice(stayId)
    System-->>GuestOrClerk: invoiceDocument
```

### Operation Contract

| Operation | `viewBill(stayId: String)` / `requestInvoice(stayId: String)` |
|---|---|
| Cross References | Use Case: View or Request Bill |
| Preconditions | 1. Actor is logged in<br>2. A stay, reservation, or set of charges exists for the guest in the system |
| Postconditions | 1. Bill view event was logged for the stay<br>2. An invoice document was generated containing all line items, dates, and totals (if requested)<br>3. Invoice was made available for download or sent to the guest's email (if requested)<br>4. Invoice request was logged (if applicable) |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:BillHandler` | Use-case controller; handles both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:ReservationCatalog` | Holds all Reservation data; retrieves the stay by ID |
| **Information Expert** | `reservation:Reservation` | Knows its own charges (room rate, dates, totalCost) |
| **Information Expert + Pure Fabrication** | `:PurchaseCatalog` | Holds all store purchase records linked to a stay |
| **Pure Fabrication** | `:InvoiceGenerator` | Generates the formatted invoice document; no domain counterpart |
| **Pure Fabrication** | `:AuditLog` | Logs bill views and invoice requests |

```mermaid
sequenceDiagram
    actor GuestOrClerk as Actor
    participant ctrl as BillHandler
    participant rcat as ReservationCatalog
    participant res as Reservation
    participant pc as PurchaseCatalog
    participant ig as InvoiceGenerator
    participant al as AuditLog

    Note over ctrl,al: [1] viewBill(stayId)
    GuestOrClerk->>ctrl: viewBill(stayId)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>rcat: getReservation(stayId)
    activate rcat
    Note right of rcat: GRASP: Information Expert + Pure Fabrication
    rcat-->>ctrl: reservation
    deactivate rcat

    ctrl->>pc: getByReservation(stayId)
    activate pc
    Note right of pc: GRASP: Information Expert + Pure Fabrication
    pc-->>ctrl: purchases
    deactivate pc

    ctrl->>res: getChargesSummary()
    activate res
    Note right of res: GRASP: Information Expert
    res-->>ctrl: chargesSummary
    deactivate res

    ctrl->>al: logBillView(stayId, actorId)
    activate al
    Note right of al: GRASP: Pure Fabrication
    al-->>ctrl: ok
    deactivate al

    ctrl-->>GuestOrClerk: itemizedBill
    deactivate ctrl

    Note over ctrl,al: [2] requestInvoice(stayId)
    GuestOrClerk->>ctrl: requestInvoice(stayId)
    activate ctrl

    ctrl->>rcat: getReservation(stayId)
    activate rcat
    rcat-->>ctrl: reservation
    deactivate rcat

    ctrl->>pc: getByReservation(stayId)
    activate pc
    pc-->>ctrl: purchases
    deactivate pc

    ctrl->>ig: generate(reservation, purchases)
    activate ig
    Note right of ig: GRASP: Pure Fabrication
    ig-->>ctrl: invoiceDocument
    deactivate ig

    ctrl->>al: logInvoiceRequest(stayId, actorId)
    activate al
    al-->>ctrl: ok
    deactivate al

    ctrl-->>GuestOrClerk: invoiceDocument
    deactivate ctrl
```

---


