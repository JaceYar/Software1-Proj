# Process Check-Out — Design Sequence Diagram

**Author:** Aaron
**Source Use Case:** `ProcessCheckOut.md`

## GRASP Patterns Applied

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:CheckOutHandler` | Use-case controller; receives both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:ReservationCatalog` | Holds all Reservation data; finds active stays by guest/room/ID |
| **Information Expert** | `reservation:Reservation` | Has `rateType`, `checkInDate`, `checkOutDate`, `totalCost` — calculates its own final bill and records its own check-out state |
| **Information Expert** | `room:Room` | Has `maxDailyRate`, `promotionRate` — expert on rate data used in billing |
| **Information Expert + Pure Fabrication** | `:PurchaseCatalog` | Records all store/incidental purchases linked to a reservation; no direct domain class |
| **Information Expert** | `guest:Guest` | Manages its own `checkedIn` flag |

## Sequence Diagram

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

    ctrl->>r: setStatus("available")
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
