# Process Check-In — Design Sequence Diagram

**Author:** Erick Martinez
**Source Use Case:** `ProcessCheckIn.md`

## GRASP Patterns Applied

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:CheckInHandler` | Use-case controller; handles both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:ReservationCatalog` | Holds all Reservation data; finds reservations by name or confirmation number |
| **Information Expert + Pure Fabrication** | `:RoomCatalog` | Holds all Room data; looks up a specific room by ID |
| **Information Expert** | `reservation:Reservation` | Records its own `checkInTimestamp` and updates its room association |
| **Information Expert** | `room:Room` | Manages its own `status` attribute |
| **Information Expert** | `guest:Guest` | Manages its own `checkedIn` flag |

## Sequence Diagram

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

    ctrl->>r: setStatus("occupied")
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
