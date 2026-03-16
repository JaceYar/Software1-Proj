# Add Room — Design Sequence Diagram

**Author:** Jace Yarborough
**Source Use Case:** `HotelClerkAddRoom.md`

## GRASP Patterns Applied

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:RoomManagementHandler` | Use-case controller; receives the `addRoom` system operation |
| **Information Expert** | `:RoomCatalog` | Knows all existing room numbers; can check uniqueness before creation |
| **Creator** | `:RoomCatalog` | Records Room instances (GRASP Creator: B records A → B creates A); creates the new Room |
| **Information Expert** | `room:Room` | Initializes and manages its own `status` attribute upon creation |
| **Pure Fabrication** | `:AuditLog` | Records all room additions for the audit trail; no direct domain counterpart |

## Sequence Diagram

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
    r->>r: setStatus("available")
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
