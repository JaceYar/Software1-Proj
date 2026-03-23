# Design Compliance Refactoring Plan

## Context
The Spring Boot application in `src/` works correctly but violates several design principles from `prompts/software-design.md`:
- **DRY**: `extractToken()` is copy-pasted into all 5 controllers; `AdminController` duplicates auth checks
- **DIP**: No service interfaces (controllers depend on concrete classes); no repository layer (services hold raw jOOQ SQL); `BCryptPasswordEncoder` instantiated with `new` in two places
- **SRP**: `AdminController` contains raw DB queries (no AdminService); `StoreService` mixes products/cart/orders/billing
- **Tests**: Only one trivial test (`assertTrue(true)`)

**Goal**: Structural refactoring only — no functional changes, no endpoint changes, no frontend impact.

---

## Phase 1: Pure Fabrication + Config (no dependencies)

### 1.1 New: `src/main/java/edu/baylor/cs/util/TokenExtractor.java`
Static utility class. Single method: `public static String fromHeader(String authorizationHeader)` — strips `"Bearer "` prefix. Replaces the 5 identical `extractToken()` private methods.

### 1.2 New: `src/main/java/edu/baylor/cs/config/PasswordEncoderConfig.java`
`@Configuration` class with single `@Bean BCryptPasswordEncoder passwordEncoder()`. Follows the pattern of existing `WebConfig.java`.

---

## Phase 2: Repository Layer (5 interfaces + 5 jOOQ implementations)

Package: `edu.baylor.cs.repository`

### 2.1 `UserRepository` interface + `JooqUserRepository` (`@Repository`)
Moves all `USERS` table queries out of `AuthService` and `AdminController`.
Methods: `existsByUsername`, `findByUsername`, `findById`, `insertGuest`, `insertClerk`, `updatePasswordHash`, `findAllSummary`

### 2.2 `RoomRepository` interface + `JooqRoomRepository` (`@Repository`)
Moves all `ROOMS` queries out of `RoomService` and room-status updates from `ReservationService`.
Methods: `findAll`, `findAvailableBetween`, `findById`, `insert`, `update`, `findDailyRateById`, `updateStatus`

### 2.3 `ReservationRepository` interface + `JooqReservationRepository` (`@Repository`)
Moves all `RESERVATIONS` queries out of `ReservationService`. The 3 near-identical SELECT+JOIN patterns (`getReservationsForUser`, `getAllReservations`, `fetchReservation`) become `findByUserId`, `findAll`, `findByIdWithRoomNumber` — all returning `org.jooq.Record` (mapping to DTO stays in service's existing `toDto()` helper).
Methods: `hasConflict`, `findAll`, `findByUserId`, `findByIdWithRoomNumber`, `findById`, `insert`, `updateStatus`, `updateCancellation`

### 2.4 `ProductRepository` interface + `JooqProductRepository` (`@Repository`)
Moves PRODUCTS queries from `StoreService`.
Methods: `findAll`, `findStockById`, `findPriceById`, `decrementStockForOrder(int orderId, DSLContext)` — or simpler: `getItemsForOrder` + service loops over result calling `decrementStock(productId, qty)`

### 2.5 `OrderRepository` interface + `JooqOrderRepository` (`@Repository`)
Moves ORDERS/ORDER_ITEMS/BILLS queries from `StoreService`.
Methods: `findCartIdByUserId`, `insertCart`, `insertOrderItem`, `findCartItemsByUserId`, `calculateCartTotal`, `markPurchased`, `insertBill`, `getItemProductsAndQuantities` (for stock decrement loop)

---

## Phase 3: Service Interfaces (5 new interfaces)

Package: `edu.baylor.cs.service`

- `IAuthService`: `register`, `login`, `logout`, `getUserFromToken`
- `IReservationService`: `getAllReservations`, `getReservationsForUser`, `createReservation`, `cancelReservation`, `checkIn`, `checkOut`
- `IRoomService`: `getAllRooms`, `getAvailableRooms`, `getRoom`, `createRoom`, `updateRoom`
- `IStoreService`: `getAllProducts`, `getCart`, `addToCart`, `checkout`
- `IAdminService`: `createClerk`, `resetPassword`, `getAllUsers`

---

## Phase 4: Modify Services + Create AdminService

### 4.1 Modify `AuthService` (implements `IAuthService`)
- Constructor: `(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder)` — remove `DSLContext db`
- Remove `private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder()` field initializer
- Replace `db.*` calls with `userRepository.*` calls
- `sessions` ConcurrentHashMap stays (session management is AuthService's responsibility)

### 4.2 Modify `ReservationService` (implements `IReservationService`)
- Constructor: `(ReservationRepository reservationRepository, RoomRepository roomRepository)` — remove `DSLContext db`
- `toDto(org.jooq.Record r)` private helper stays
- `fetchReservation(int id)` now delegates to `reservationRepository.findByIdWithRoomNumber(id)` then `toDto()`

### 4.3 Modify `RoomService` (implements `IRoomService`)
- Constructor: `(RoomRepository roomRepository)` — remove `DSLContext db`
- `toDto(RoomsRecord r)` private helper stays

### 4.4 Modify `StoreService` (implements `IStoreService`)
- Constructor: `(ReservationRepository reservationRepository, ProductRepository productRepository, OrderRepository orderRepository)` — remove `DSLContext db`
- Stock decrement loop: `orderRepository.getItemsForOrder(orderId)` returns list of `{productId, qty}` pairs; service loops and calls `productRepository.decrementStock(productId, qty)` per item

### 4.5 New: `AdminService` (implements `IAdminService`, annotated `@Service`)
Moves all `AdminController` business logic + DB calls.
- Constructor: `(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder)`
- `createClerk`: calls `userRepository.existsByUsername`, `userRepository.insertClerk` — same logic as current `AdminController.createClerk`
- `resetPassword`: calls `userRepository.updatePasswordHash` — same logic
- `getAllUsers`: calls `userRepository.findAllSummary` — same logic

---

## Phase 5: Modify Controllers

All 5 controllers get the same two changes:
1. Inject interface type instead of concrete service class
2. Replace `extractToken(header)` with `TokenExtractor.fromHeader(header)` and delete `extractToken()` method

**`AdminController`**: Constructor changes from `(DSLContext db, AuthService authService)` to `(IAdminService adminService, IAuthService authService)`. Remove `DSLContext db` field, `BCryptPasswordEncoder` field, jOOQ imports. Each handler body becomes a single `adminService.*` delegation call.

**`AuthController`**: `AuthService` → `IAuthService`
**`ReservationController`**: `ReservationService` → `IReservationService`, `AuthService` → `IAuthService`
**`RoomController`**: `RoomService` → `IRoomService`, `AuthService` → `IAuthService`
**`StoreController`**: `StoreService` → `IStoreService`, `AuthService` → `IAuthService`

---

## Phase 6: Tests

### Service unit tests (JUnit 5 + Mockito, `@ExtendWith(MockitoExtension.class)`)

**`TokenExtractorTest`** — `src/test/java/edu/baylor/cs/util/TokenExtractorTest.java`
- null input, no Bearer prefix, valid `"Bearer xyz"` → strips to `"xyz"`, `"Bearer "` alone → empty string

**`AuthServiceTest`** — `src/test/java/edu/baylor/cs/service/AuthServiceTest.java`
Mocks: `UserRepository`, `BCryptPasswordEncoder`
- `register_newUsername_createsSessionAndReturnsToken`
- `register_duplicateUsername_throwsIllegalArgument`
- `login_validCredentials_returnsAuthResponse`
- `login_wrongPassword_throwsIllegalArgument`
- `login_unknownUser_throwsIllegalArgument`
- `getUserFromToken_validToken_returnsUser`
- `getUserFromToken_unknownToken_returnsNull`
- `logout_removesToken`

**`AdminServiceTest`** — `src/test/java/edu/baylor/cs/service/AdminServiceTest.java`
Mocks: `UserRepository`, `BCryptPasswordEncoder`
- `createClerk_newUsername_returnsCredentialsMap`
- `createClerk_existingUsername_throwsIllegalArgument`
- `resetPassword_existingUser_returnsSuccessMap`
- `resetPassword_missingUser_throwsIllegalArgument`
- `getAllUsers_delegatesToRepository`

**`ReservationServiceTest`** — `src/test/java/edu/baylor/cs/service/ReservationServiceTest.java`
Mocks: `ReservationRepository`, `RoomRepository`
- `createReservation_noConflict_returnsDto`
- `createReservation_conflict_throwsIllegalArgument`
- `createReservation_roomNotFound_throwsIllegalArgument`
- `cancelReservation_withinGracePeriod_zeroCancellationFee`
- `cancelReservation_outsideGracePeriod_chargesFee`
- `cancelReservation_alreadyCancelled_throwsIllegalArgument`
- `cancelReservation_checkedIn_throwsIllegalArgument`
- `cancelReservation_guestCancelsOtherGuest_throwsIllegalArgument`
- `checkIn_confirmedReservation_updatesStatusAndRoomStatus`
- `checkOut_checkedInReservation_updatesStatusAndRoomStatus`

**`RoomServiceTest`** — `src/test/java/edu/baylor/cs/service/RoomServiceTest.java`
Mocks: `RoomRepository`
- `getAllRooms_returnsMappedDtos`
- `getRoom_existingId_returnsDto`
- `getRoom_missingId_throwsIllegalArgument`
- `getAvailableRooms_returnsMappedDtos`
- `createRoom_callsInsert_returnsDto`
- `updateRoom_callsUpdate_returnsDto`

**`StoreServiceTest`** — `src/test/java/edu/baylor/cs/service/StoreServiceTest.java`
Mocks: `ReservationRepository`, `ProductRepository`, `OrderRepository`
- `getAllProducts_returnsMappedDtos`
- `addToCart_checkedInGuestWithStock_returnsOrderInfo`
- `addToCart_notCheckedIn_throwsIllegalArgument`
- `addToCart_insufficientStock_throwsIllegalArgument`
- `checkout_activeCart_createsBillAndDecrementsStock`
- `checkout_noActiveCart_throwsIllegalArgument`

### Controller tests (`@WebMvcTest` + `@MockBean`)

**`AdminControllerTest`**, **`AuthControllerTest`**, **`ReservationControllerTest`**, **`RoomControllerTest`**, **`StoreControllerTest`** — in `src/test/java/edu/baylor/cs/controller/`

Each uses `@WebMvcTest(XController.class)` with `@MockBean IXService` and `@MockBean IAuthService`. `authService.getUserFromToken(any())` returns a mock `UsersRecord` (with appropriate role) or null depending on the scenario. Tests verify HTTP status codes and key response fields via `jsonPath`.

---

## Phase 7: `run_tests.sh`

**File:** `run_tests.sh` at project root (no `mvnw` found, use `mvn`)

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "Running all tests..."
mvn test
echo "Test run complete."
```

Run `chmod +x run_tests.sh` after creation.

---

## New Files Summary

```
src/main/java/edu/baylor/cs/
├── config/PasswordEncoderConfig.java
├── util/TokenExtractor.java
├── repository/
│   ├── UserRepository.java + JooqUserRepository.java
│   ├── RoomRepository.java + JooqRoomRepository.java
│   ├── ReservationRepository.java + JooqReservationRepository.java
│   ├── ProductRepository.java + JooqProductRepository.java
│   └── OrderRepository.java + JooqOrderRepository.java
└── service/
    ├── IAuthService.java, IReservationService.java, IRoomService.java
    ├── IStoreService.java, IAdminService.java
    └── AdminService.java

src/test/java/edu/baylor/cs/
├── util/TokenExtractorTest.java
├── service/AuthServiceTest.java, AdminServiceTest.java, ReservationServiceTest.java
│         RoomServiceTest.java, StoreServiceTest.java
└── controller/AdminControllerTest.java, AuthControllerTest.java
              ReservationControllerTest.java, RoomControllerTest.java, StoreControllerTest.java

run_tests.sh (project root)
```

## Modified Files Summary

```
src/main/java/edu/baylor/cs/
├── service/AuthService.java, ReservationService.java, RoomService.java, StoreService.java
└── controller/AdminController.java, AuthController.java, ReservationController.java
              RoomController.java, StoreController.java
```

## Verification

1. `mvn compile` — must pass with no errors after each phase
2. `./run_tests.sh` — all new tests pass
3. Start the application (`mvn spring-boot:run`) and manually hit a few endpoints to confirm no regressions
4. Confirm all 5 HTTP endpoints still have identical paths/request shapes as before
