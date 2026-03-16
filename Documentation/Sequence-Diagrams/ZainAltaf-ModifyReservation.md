# Modify Reservation — Design Sequence Diagram

**Author:** Zain Altaf
**Source Use Case:** `ModifyReservation.md`

## GRASP Patterns Applied

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:ModifyReservationHandler` | Use-case controller; handles both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:ReservationCatalog` | Holds all Reservation data; retrieves reservations by guest and by ID |
| **Information Expert** | `reservation:Reservation` | Has `checkInDate` — enforces the X-hour modification policy; applies its own date/room changes and recalculates `totalCost` |
| **Information Expert** | `room:Room` | Has `maxDailyRate`, `promotionRate` — provides rate data for cost recalculation |
| **Information Expert + Pure Fabrication** | `:RoomCatalog` | Checks availability for the requested room type and date range |

## Sequence Diagram

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
    Note right of res: GRASP: Information Expert<br>(Reservation knows its checkInDate;<br>enforces X-hour modification policy)
    res-->>ctrl: canModify
    deactivate res

    alt canModify == true
        ctrl->>rmc: getAvailableRoomByType(newCheckInDate, newCheckOutDate, newRoomType)
        activate rmc
        Note right of rmc: GRASP: Information Expert<br>+ Pure Fabrication
        rmc-->>ctrl: room
        deactivate rmc

        ctrl->>res: applyModification(newCheckInDate, newCheckOutDate, room)
        activate res
        Note right of res: GRASP: Information Expert<br>(Reservation applies changes<br>to its own state)

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
    else canModify == false
        ctrl-->>Guest: modificationDenied("Policy: cannot modify within X hours of check-in")
    end

    deactivate ctrl
```
