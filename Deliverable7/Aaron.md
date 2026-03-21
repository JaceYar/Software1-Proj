# Aaron — Use Cases

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

---

## View or Request Bill

| Use Case Name | View or Request Bill |
|---------------|--------------------|
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
