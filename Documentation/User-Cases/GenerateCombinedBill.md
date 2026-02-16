| Use Case Name | Generate Combined Bill |
|---------------|------------------------|
| Actor         | Hotel Clerk            |
| Author        | Zain Altaf             |
| Preconditions | 1. The hotel clerk is logged into the system. <br>2. The guest has completed check-out. <br>3. The guest has at least one reservation recorded in the system. |
| Postconditions | 1. A combined bill is generated for the guest. <br>2. The bill includes all room charges and store purchases. <br>3. The finalized bill is stored in the system. |
| Main Success Scenario | 1. The clerk selects a checked-out guest. <br>2. The system retrieves the guest’s reservation details. <br>3. The system retrieves all store purchases made during the guest’s stay. <br>4. The system calculates the total room charges. <br>5. The system calculates the total store charges. <br>6. The system applies any taxes or additional fees. <br>7. The system combines all charges into a single bill. <br>8. The system displays the bill summary. <br>9. The clerk reviews and confirms the bill. <br>10. The system finalizes and stores the bill. |
| Extensions | [3]a. **No store purchases recorded**<br>&nbsp;&nbsp;&nbsp;&nbsp;[3]a1 The system generates a bill including only room charges.<br><br>[2]b. **Corporate guest billing**<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]b1 The system marks the bill as corporate billing.<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]b2 The payment status is set to pending. |
| Special Reqs | ● Bill calculations must be accurate and consistent with reservation and purchase records.<br>● Tax calculations must follow applicable hotel policies.<br>● The generated bill must be stored for auditing and reporting purposes. |
