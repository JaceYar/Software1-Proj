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

    Clerk->>System: Navigate to room management page
    Clerk->>System: Select "Add New Room"
    System-->>Clerk: Display room entry form
    Clerk->>System: Enter room details and submit form
    System->>System: Validate all fields
    System->>System: Verify room number is unique
    System->>System: Save room to database
    System-->>Clerk: Display success message
    Clerk->>System: Return to room management page
```

---

## Operation Contract

| Operation | `addRoom(roomNumber: String, theme: String, roomType: String, bedType: String, smokingStatus: Boolean, qualityLevel: String, maxDailyRate: Decimal)` |
|---|---|
| Cross References | Use Case: Add Room |
| Preconditions | 1. Hotel clerk is logged in<br>2. System is operational |
| Postconditions | 1. A new Room instance was created and saved to the database<br>2. Room was associated with the hotel inventory<br>3. Room.status was set to 'available'<br>4. The room addition was logged |
