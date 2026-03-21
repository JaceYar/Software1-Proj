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

