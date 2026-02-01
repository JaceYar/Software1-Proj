# Use Case Name:
Process Check-In

# Actor
Hotel Clerk

# Preconditions
- The hotel system is functional and online
- The clerk is logged in to the system
- The guest has an existing reservation for the current date
- At least one room matching the reservation criteria is available

# Postconditions
- The guest is checked in and assigned to a specific room
- The room status is updated to occupied
- The check-in date and time are recorded
- The guest can access hotel services (including the store)

# Main Success Scenario
1. The clerk searches for the guest's reservation by name or confirmation number
2. The system displays the reservation details
3. The clerk verifies the guest's identity
4. The clerk confirms the reservation details with the guest
5. The system displays available rooms matching the reservation
6. The clerk selects a room to assign to the guest
7. The system allocates the room to the guest
8. The system updates the room status to occupied
9. The system records the check-in timestamp
10. The clerk provides the room key/access information to the guest
11. The system displays check-in confirmation

# Extensions
1a. Reservation not found:
    1. The clerk verifies guest information
    2. The clerk offers to create a new reservation (see Make Reservation use case)
    3. Use case ends or continues with new reservation

4a. Guest requests different room type:
    1. The clerk searches for alternative available rooms
    2. The system displays available alternatives with price differences
    3. The guest selects a new room type
    4. The system updates the reservation with new rate if applicable
    5. Continue from step 5

6a. No rooms available matching reservation:
    1. The system notifies the clerk of the situation
    2. The clerk offers an upgrade or alternative room
    3. The guest accepts or declines the alternative
    4. If declined, the clerk processes a cancellation with no penalty
    5. Use case ends or continues with alternative room

# Special Requirements
- Check-in must update room availability in real-time
- Guest must have an active reservation to access store purchasing
