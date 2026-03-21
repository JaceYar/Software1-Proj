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

