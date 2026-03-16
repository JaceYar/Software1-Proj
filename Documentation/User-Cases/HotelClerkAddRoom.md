| Use Case Name | Add Room |
|---|---|
| Actor | Hotel Clerk |
| Author | Jace Yarborough |
| Preconditions | 1. System operational<br>2. Hotel clerk is logged in |
| Postconditions | 1. New room is added to hotel inventory<br>2. Room is available for reservations |
| Main Success Scenario | 1. Hotel clerk navigates to room management page<br>2. Hotel clerk selects "Add New Room"<br>3. System displays room entry form<br>4. Hotel clerk enters room details:<br>&nbsp;&nbsp;&nbsp;&nbsp;- Room number<br>&nbsp;&nbsp;&nbsp;&nbsp;- Floor/theme (Nature Retreat, Urban Elegance, Vintage Charm)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Room type (single, double, family, suite, deluxe, standard)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Bed type and quantity (twin, full, queen, king)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Smoking/non-smoking status<br>&nbsp;&nbsp;&nbsp;&nbsp;- Quality level (executive, business, comfort, economy)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Maximum daily rate<br>5. Hotel clerk submits form<br>6. System validates all fields<br>7. System verifies room number is unique<br>8. System saves room to database<br>9. System displays success message<br>10. Hotel clerk returns to room management page |
| Extensions | [6]a. **Required fields missing**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 System highlights missing fields<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 System displays error "Please fill in all required fields"<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a3 Return to step 4<br>[6]b. **Invalid data format**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b1 System displays error "Invalid format for [field name]"<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b2 Return to step 4<br>[7]a. **Duplicate room number**<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a1 System displays error "Room number already exists"<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a2 Return to step 4<br>[8]a. **Database error**<br>&nbsp;&nbsp;&nbsp;&nbsp;[8]a1 System displays error "Unable to add room. Try again"<br>&nbsp;&nbsp;&nbsp;&nbsp;[8]a2 Use case ends |
| Special Reqs | ● Room numbers must follow hotel numbering convention<br>● Maximum daily rate must be positive value<br>● All room additions must be logged |

```mermaid
sequenceDiagram
    actor Clerk
    participant System

    Clerk->>System: addRoom(roomNumber, theme, roomType, bedType, smokingStatus, qualityLevel, maxDailyRate)
    System-->>Clerk: roomAdditionConfirmation
```

### Operation Contract

| Operation | `addRoom(roomNumber: String, theme: String, roomType: String, bedType: String, smokingStatus: Boolean, qualityLevel: String, maxDailyRate: Decimal)` |
|---|---|
| Cross References | Use Case: Add Room |
| Preconditions | 1. Hotel clerk is logged in<br>2. System is operational |
| Postconditions | 1. A new Room instance was created and saved to the database<br>2. Room was associated with the hotel inventory<br>3. Room.status was set to 'available'<br>4. The room addition was logged |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:RoomManagementHandler` | Use-case controller; receives the `addRoom` system operation |
| **Information Expert** | `:RoomCatalog` | Knows all existing room numbers; can check uniqueness before creation |
| **Creator** | `:RoomCatalog` | Records Room instances (GRASP Creator: B records A → B creates A); creates the new Room |
| **Information Expert** | `room:Room` | Initializes and manages its own `status` attribute upon creation |
| **Pure Fabrication** | `:AuditLog` | Records all room additions for the audit trail; no direct domain counterpart |

```mermaid
sequenceDiagram
    actor Clerk
    participant ctrl as :RoomManagementHandler
    participant rc as :RoomCatalog
    participant r as room:Room
    participant al as :AuditLog

    Clerk->>ctrl: addRoom(roomNumber, theme, roomType, bedType, smokingStatus, qualityLevel, maxDailyRate)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>rc: isRoomNumberUnique(roomNumber)
    activate rc
    Note right of rc: GRASP: Information Expert<br>(RoomCatalog knows all existing<br>room numbers)
    rc-->>ctrl: true
    deactivate rc

    ctrl->>rc: createRoom(roomNumber, theme, roomType, bedType, smokingStatus, qualityLevel, maxDailyRate)
    activate rc
    Note right of rc: GRASP: Creator<br>(RoomCatalog records Room instances)
    rc->>r: <<create>>(roomNumber, theme, roomType, bedType, smokingStatus, qualityLevel, maxDailyRate)
    activate r
    r->>r: setStatus(available)
    Note right of r: GRASP: Information Expert<br>(Room initializes its own status)
    rc-->>ctrl: room
    deactivate r
    deactivate rc

    ctrl->>al: logRoomAddition(room, clerkId)
    activate al
    Note right of al: GRASP: Pure Fabrication<br>(audit trail for room additions)
    al-->>ctrl: ok
    deactivate al

    ctrl-->>Clerk: roomAdditionConfirmation
    deactivate ctrl
```
