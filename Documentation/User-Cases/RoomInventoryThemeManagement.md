| Use Case Name | Configure Room Inventory |
|---------------|-----------------|
| Actor         | Hotel Clerk    |
| Preconditions | 1. The clerk is logged into an authorized Clerk account |
| Postconditions | 1. A new room is added to the hotel inventory with a specific theme and daily rate |
| Main Success Scenario | 1. The clerk selects the "Manage Rooms" dashboard <br>2. The clerk enters a Room Number and selects a Floor/Theme (e.g., Nature Retreat) <br>3. The clerk assigns a Bed Type (Twin, Full, Queen, King) and Quality Level <br>4. The system calculates the "Maximum Daily Rate" based on the Quality Level <br>5. The system saves the room status as "Available" for future searches |
| Extensions | [2]a. **Duplicate Room Number**<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]a1 System prevents saving and alerts the clerk that the room number already exists<br>[4]a. **Rate Overrides**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 Clerk can manually set a "Promotion Rate" for a specific room |
| Special Reqs | ● Data Integrity: The system must enforce that "Suite" types only exist on the "Urban Elegance" floor as per the problem statement |

Author: Jonathan Deiss
