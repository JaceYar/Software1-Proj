# Zain Altaf — Use Cases

## Modify Reservation

| Use Case Name| Modify Reservation |
|---------------|--------------------|
| Actor         | Hotel Guest    |
| Author        | Zain Altaf     |
| Preconditions | 1. The hotel guest is logged into the system. <br>2.The guest has an existing reservation. <br> 3. The reservation has not yet started.|
| Postconditions | 1. The reservation is updated only if modification is permitted. <br> 2. If modification is not permitted, the reservation remains unchanged. <br> 3. Any change in price is recalculated and recorded. |
| Main Success Scenario | 1. The guest selects the option to view their reservations. <br>2. The system displays the guest's reservations.<br>3. The guest selects a reservation to modify.<br>4. The system displays the current reservation details <br> 5.The guest enters the requested changes (e.g., dates or room type).<br> 6. The system checks whether the modification request is more than X hours before the check-in time. <br> 7. The system checks room availability for the requested changes. <br> 8. The system recalculates the reservation cost, if applicable. <br> 9. The system displays the updated reservation details. <br> 10. The guest confirms the modification. <br> 11. The system updates the reservation. <br> 12. The system displays a modification confirmation message.|
| Extensions | [6]a. **Modification not allowed (within X hours of check-in)**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 The system determines that the modification request is within X hours of the check-in time.<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 The system displays a message explaining that modifications are not permitted according to the policy.|
| Special Reqs | ● The system must enforce the X-hour modification policy exactly.<br>● Availability checks must be consistent with current reservations.<br> ● Price recalculation must follow hotel pricing rules.|

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

---

## Generate Combined Bill

| Use Case Name | Generate Combined Bill |
|---------------|------------------------|
| Actor         | Hotel Clerk            |
| Author        | Zain Altaf             |
| Preconditions | 1. The hotel clerk is logged into the system. <br>2. The guest has completed check-out. <br>3. The guest has at least one reservation recorded in the system. |
| Postconditions | 1. A combined bill is generated for the guest. <br>2. The bill includes all room charges and store purchases. <br>3. The finalized bill is stored in the system. |
| Main Success Scenario | 1. The clerk selects a checked-out guest. <br>2. The system retrieves the guest's reservation details. <br>3. The system retrieves all store purchases made during the guest's stay. <br>4. The system calculates the total room charges. <br>5. The system calculates the total store charges. <br>6. The system applies any taxes or additional fees. <br>7. The system combines all charges into a single bill. <br>8. The system displays the bill summary. <br>9. The clerk reviews and confirms the bill. <br>10. The system finalizes and stores the bill. |
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

---

## Cancel Reservation

| Use Case Name| Cancel Reservation |
|---------------|--------------------|
| Actor         | Hotel Guest    |
| Author        | Zain Altaf     |
| Preconditions | 1. The hotel guest is logged into the system. <br>2. The guest has an existing reservation.|
| Postconditions | 1. The reservation is canceled only if cancellation is permitted. <br> 2. If cancellation is permitted, any applicable cancellation penalty is recorded. <br> 3.If cancellation is not permitted, the reservation remains unchanged.|
| Main Success Scenario | 1. The guest selects the option to view reservations. <br>2. The system displays the guest's reservations.<br>3. The guest selects a reservation to cancel. <br>4. The system checks the time remaining until the reservation's check-in date. <br> 5. The system determines that the cancellation request is more than the required time. <br> 6. The system displays the applicable cancellation policy and any penalty(if required). <br> 7. The guest confirms the cancellation. <br> 8.The system cancels the reservation. <br> 9. The system displays a cancellation confirmation message.|
| Extensions | [4]a. **Cancellation not allowed (within a specific time frame)**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 The system determines that the cancellation request is within x hours of the check-in time.<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 The system displays a message explaining that cancellation is not permitted according to the policy.<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a3 The reservation remains unchanged.|
| Special Reqs | ● The system must enforce the X-hour cancellation policy exactly.<br>● Time comparisons must use the hotel's local time zone. <br> ● All cancellation attempts must be logged for auditing and billing purposes.|

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
