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

