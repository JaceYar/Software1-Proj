| Use Case Name| Modify Reservation |
|---------------|-----------------|
| Actor         | Hotel Guest    |
| Author        | Zain Altaf     |
| Preconditions | 1. The hotel guest is logged into the system. <br>2.The guest has an existing reservation. <br> 3. The reservation has not yet started.|
|Postconditions | 1. The reservation is updated only if modification is permitted. <br> 2. If modification is not permitted, the reservation remains unchanged. <br> 3. Any change in price is recalculated and recorded. |
|Main Success Scenario| 1. The guest selects the option to view their reservations. <br>2. The system displays the guest’s reservations.<br>3. The guest selects a reservation to modify.<br>4. The system displays the current reservation details <br> 5.The guest enters the requested changes (e.g., dates or room type).<br> 6. The system checks whether the modification request is more than X hours before the check-in time. <br> 7. The system checks room availability for the requested changes. <br> 8. The system recalculates the reservation cost, if applicable. <br> 9. The system displays the updated reservation details. <br> 10. The guest confirms the modification. <br> 11. The system updates the reservation. <br> 12. The system displays a modification confirmation message.|
|Extensions| [6]a. **Modification not allowed (within X hours of check-in)**<br>&nbsp;&nbsp;&nbsp;&nbsp;    [6]a1 The system determines that the modification request is within X hours of the check-in time.<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 The system displays a message explaining that modifications are not permitted according to the policy.|
|Special Reqs| ● The system must enforce the X-hour modification policy exactly.<br>● Availability checks must be consistent with current reservations.<br> ● Price recalculation must follow hotel pricing rules.|

