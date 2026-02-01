# Use Case Name:
Make Reservation

# Actor
Hotel Guest

# Preconditions
- The hotel system is functional and online
- The user is logged in to the system
- Room and reservation data exists in the database
- The user has searched for available rooms

# Postconditions
- A new reservation is created in the system
- The selected room is marked as reserved for the specified dates
- Guest information is recorded (name, address, credit card number, expiration date)
- Confirmation is displayed to the user

# Main Success Scenario
1. The user selects a room from the list of available rooms
2. The user enters the check-in and check-out dates
3. The user selects the rate type (standard, promotion, group, or non-refundable)
4. The user enters or confirms their personal information (name, address)
5. The user enters payment information (credit card number, expiration date)
6. The system validates all input data
7. The system verifies room availability for the selected dates
8. The system calculates the total cost based on quality level and rate type
9. The system creates the reservation and stores it in the database
10. The system displays reservation confirmation with details

# Extensions
3a. Corporate guest selected:
    1. The user selects their corporation from the list
    2. The system records the corporation for billing purposes
    3. Continue from step 4

6a. Invalid input data:
    1. The system displays an error message indicating the invalid fields
    2. The user corrects the input
    3. Continue from step 6

7a. Room is no longer available:
    1. The system notifies the user that the room has been booked
    2. The system redirects the user to search for available rooms
    3. Use case ends

# Special Requirements
- Credit card information must be securely stored
- Reservation must be atomic (all or nothing)
