# Clerk Makes Reservation for Guest — Design Sequence Diagram

**Author:** Jonathan Deiss
**Source Use Case:** `ClerkMakesReservation.md`

## GRASP Patterns Applied

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:MakeReservationHandler` | Use-case controller; handles all three system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:GuestCatalog` | Holds all Guest data; no direct domain counterpart |
| **Information Expert + Pure Fabrication** | `:RoomCatalog` | Holds all Room data; knows which rooms are available |
| **Creator** | `guest:Guest` | Domain model shows `Guest "1"--"*" Reservation : makes`; Guest aggregates Reservations |
| **Information Expert** | `room:Room` | Has `maxDailyRate`, `promotionRate`, `qualityLevel` — expert on rate data |
| **Information Expert** | `reservation:Reservation` | Has `rateType`, `checkInDate`, `checkOutDate` — calculates its own `totalCost` |
| **Pure Fabrication** | `:ReservationCatalog` | Records and persists all Reservations without burdening domain objects |

## Sequence Diagram

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
