# Use Case: Add Room

| Field | Details |
|---|---|
| **Use Case Name** | Add Room |
| **Actor** | Hotel Clerk |
| **Author** | Jace Yarborough |
| **Preconditions** | 1. System operational<br>2. Hotel clerk is logged in |
| **Postconditions** | 1. New room is added to hotel inventory<br>2. Room is available for reservations |
| **Main Success Scenario** | 1. Hotel clerk navigates to room management page<br>2. Hotel clerk selects "Add New Room"<br>3. System displays room entry form<br>4. Hotel clerk enters room details:<br>&nbsp;&nbsp;&nbsp;&nbsp;- Room number<br>&nbsp;&nbsp;&nbsp;&nbsp;- Floor/theme (Nature Retreat, Urban Elegance, Vintage Charm)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Room type (single, double, family, suite, deluxe, standard)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Bed type and quantity (twin, full, queen, king)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Smoking/non-smoking status<br>&nbsp;&nbsp;&nbsp;&nbsp;- Quality level (executive, business, comfort, economy)<br>&nbsp;&nbsp;&nbsp;&nbsp;- Maximum daily rate<br>5. Hotel clerk submits form<br>6. System validates all fields<br>7. System verifies room number is unique<br>8. System saves room to database<br>9. System displays success message<br>10. Hotel clerk returns to room management page |
| **Extensions** | 6a. **Required fields missing**<br>&nbsp;&nbsp;&nbsp;&nbsp;6a1 System highlights missing fields<br>&nbsp;&nbsp;&nbsp;&nbsp;6a2 System displays error "Please fill in all required fields"<br>&nbsp;&nbsp;&nbsp;&nbsp;6a3 Return to step 4<br><br>6b. **Invalid data format**<br>&nbsp;&nbsp;&nbsp;&nbsp;6b1 System displays error "Invalid format for [field name]"<br>&nbsp;&nbsp;&nbsp;&nbsp;6b2 Return to step 4<br><br>7a. **Duplicate room number**<br>&nbsp;&nbsp;&nbsp;&nbsp;7a1 System displays error "Room number already exists"<br>&nbsp;&nbsp;&nbsp;&nbsp;7a2 Return to step 4<br><br>8a. **Database error**<br>&nbsp;&nbsp;&nbsp;&nbsp;8a1 System displays error "Unable to add room. Try again"<br>&nbsp;&nbsp;&nbsp;&nbsp;8a2 Use case ends |
| **Special Requirements** | • Room numbers must follow hotel numbering convention<br>• Maximum daily rate must be positive value<br>• All room additions must be logged |
