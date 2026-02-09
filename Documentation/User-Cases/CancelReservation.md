| Use Case Name| Cancel Reservation |
|---------------|-----------------|
| Author | Zain Altaf |
| Actor         | Hotel Guest    |
| Preconditions | 1. The hotel guest is logged into the system. <br>2. The guest has an existing reservation.|
|Postconditions | 1. The reservation is canceled only if cancellation is permitted. <br> 2. If cancellation is permitted, any applicable cancellation penalty is recorded. <br> 3.If cancellation is not permitted, the reservation remains unchanged.|
|Main Success Scenario| 1. The guest selects the option to view reservations. <br>2. The system displays the guest’s reservations.<br>3. The guest selects a reservation to cancel. <br>4. The system checks the time remaining until the reservation’s check-in date. <br> 5. The system determines that the cancellation request is more than the required time. <br> 6. The system displays the applicable cancellation policy and any penalty(if required). <br> 7. The guest confirms the cancellation. <br> 8.The system cancels the reservation. <br> 9. The system displays a cancellation confirmation message.|
|Extensions| [4]a. **Cancellation not allowed (within a specific time frame)**<br>&nbsp;&nbsp;&nbsp;&nbsp;    [4]a1 he system determines that the cancellation request is within x hours of the check-in time.<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 The system displays a message explaining that cancellation is not permitted according to the policy.<br>[4]a3 The reservation remains unchanged.|
|Special Reqs| ● The system must enforce the X-hour cancellation policy exactly.<br>● Time comparisons must use the hotel’s local time zone. <br> ● All cancellation attempts must be logged for auditing and billing purposes.|
