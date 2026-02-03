# Use Case Name	Configure Room Inventory
Actor	Hotel Clerk

## Preconditions
- The clerk is logged into an authorized Clerk account.

## Postconditions
- A new room is added to the hotel inventory with a specific theme and daily rate.

## Main Success Scenario	
1. The clerk selects the "Manage Rooms" dashboard.
2. The clerk enters a Room Number and selects a Floor/Theme (e.g., Nature Retreat).
3. The clerk assigns a Bed Type (Twin, Full, Queen, King) and Quality Level.
4. The system calculates the "Maximum Daily Rate" based on the Quality Level.
5. The system saves the room status as "Available" for future searches.

## Extensions	
- [2]a. Duplicate Room Number: System prevents saving and alerts the clerk that the room number already exists.
- [4]a. Rate Overrides: Clerk can manually set a "Promotion Rate" for a specific room.


## Special Reqs	Data Integrity:
- The system must enforce that "Suite" types only exist on the "Urban Elegance" floor as per the problem statement.
