# Questions

Can we have our app's GUI be through a web app?

# Use Cases

## Admin Login

| Use Case Name | Admin Login |
|---|---|
| Actor | Admin |
| Author | Jace Yarborough |
| Preconditions | 1. System operational<br>2. User has a valid admin account with username and password |
| Postconditions | 1. Admin is successfully logged in<br>2. Admin is redirected to admin dashboard/panel |
| Main Success Scenario | 1. Admin navigates to login page<br>2. Admin enters username<br>3. Admin enters password<br>4. Admin submits credentials<br>5. System validates input<br>6. System verifies credentials<br>7. System displays success message<br>8. Admin is brought to admin dashboard |
| Extensions | 4a. **Invalid username format**<br>&nbsp;&nbsp;&nbsp;&nbsp;4a1 System detects username doesn't meet format requirements<br>&nbsp;&nbsp;&nbsp;&nbsp;4a2 System displays error message "Invalid username or password"<br>&nbsp;&nbsp;&nbsp;&nbsp;4a3 System prompts user to re-enter credentials<br>6a. **Invalid credentials**<br>&nbsp;&nbsp;&nbsp;&nbsp;6a1 System detects username or password is incorrect<br>&nbsp;&nbsp;&nbsp;&nbsp;6a2 System increments failed login attempt counter<br>&nbsp;&nbsp;&nbsp;&nbsp;6a3 System displays error message "Invalid username or password"<br>&nbsp;&nbsp;&nbsp;&nbsp;6a4 Return to step 2<br>6b. **Account locked**<br>&nbsp;&nbsp;&nbsp;&nbsp;6b1 System detects account has been locked due to multiple failed attempts<br>&nbsp;&nbsp;&nbsp;&nbsp;6b2 System displays error message "Account locked. Contact system administrator"<br>&nbsp;&nbsp;&nbsp;&nbsp;6b3 Use case ends<br>6c. **Password expired**<br>&nbsp;&nbsp;&nbsp;&nbsp;6c1 System detects password has expired<br>&nbsp;&nbsp;&nbsp;&nbsp;6c2 System prompts admin to reset password<br>&nbsp;&nbsp;&nbsp;&nbsp;6c3 Redirect to password reset use case |
| Special Reqs | • Password must be hashed in database<br>• Log all login attempts |

## Browse Product Catalog

| Use Case Name | Browse Product Catalog |
|---------------|-----------------|
| Actor         | Guest          |
| Author        | Jonathan Deiss |
| Preconditions | 1. The guest is logged into the hotel system |
| Postconditions | 1. The guest has viewed available products and their specific details |
| Main Success Scenario | 1. The guest selects the "Store" or "Shop" tab from the main dashboard <br>2. The system retrieves all product categories: Clothing, Accessories, and Local Artisanal Goods <br>3. The guest filters products by category or searches by name <br>4. The system displays a list of products including Name, Description, and Price <br>5. The guest selects a specific product to view detailed attributes (e.g., size for clothing, origin for artisanal goods) |
| Extensions | [2]a. **No Products Available**<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]a1 The system displays a "Coming Soon" or "Store is currently empty" message<br>[3]a. **Search Not Found**<br>&nbsp;&nbsp;&nbsp;&nbsp;[3]a1 The system suggests similar products or allows the user to clear filters |
| Special Reqs | ● The UI must distinguish between "Standard" items and "Exclusive Artisanal" goods as per the establishment's unique theme |

## Cancel Reservation

| Use Case Name| Cancel Reservation |
|---------------|-----------------|
| Actor         | Hotel Guest    |
| Author        | Zain Altaf     |
| Preconditions | 1. The hotel guest is logged into the system. <br>2. The guest has an existing reservation.|
|Postconditions | 1. The reservation is canceled only if cancellation is permitted. <br> 2. If cancellation is permitted, any applicable cancellation penalty is recorded. <br> 3.If cancellation is not permitted, the reservation remains unchanged.|
|Main Success Scenario| 1. The guest selects the option to view reservations. <br>2. The system displays the guest's reservations.<br>3. The guest selects a reservation to cancel. <br>4. The system checks the time remaining until the reservation's check-in date. <br> 5. The system determines that the cancellation request is more than the required time. <br> 6. The system displays the applicable cancellation policy and any penalty(if required). <br> 7. The guest confirms the cancellation. <br> 8.The system cancels the reservation. <br> 9. The system displays a cancellation confirmation message.|
|Extensions| [4]a. **Cancellation not allowed (within a specific time frame)**<br>&nbsp;&nbsp;&nbsp;&nbsp;    [4]a1 he system determines that the cancellation request is within x hours of the check-in time.<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 The system displays a message explaining that cancellation is not permitted according to the policy.<br>[4]a3 The reservation remains unchanged.|
|Special Reqs| ● The system must enforce the X-hour cancellation policy exactly.<br>● Time comparisons must use the hotel's local time zone. <br> ● All cancellation attempts must be logged for auditing and billing purposes.|

## Configure Room Inventory

| Use Case Name | Configure Room Inventory |
|---------------|-----------------|
| Actor         | Hotel Clerk    |
| Author        | Jonathan Deiss |
| Preconditions | 1. The clerk is logged into an authorized Clerk account |
| Postconditions | 1. A new room is added to the hotel inventory with a specific theme and daily rate |
| Main Success Scenario | 1. The clerk selects the "Manage Rooms" dashboard <br>2. The clerk enters a Room Number and selects a Floor/Theme (e.g., Nature Retreat) <br>3. The clerk assigns a Bed Type (Twin, Full, Queen, King) and Quality Level <br>4. The system calculates the "Maximum Daily Rate" based on the Quality Level <br>5. The system saves the room status as "Available" for future searches |
| Extensions | [2]a. **Duplicate Room Number**<br>&nbsp;&nbsp;&nbsp;&nbsp;[2]a1 System prevents saving and alerts the clerk that the room number already exists<br>[4]a. **Rate Overrides**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 Clerk can manually set a "Promotion Rate" for a specific room |
| Special Reqs | ● Data Integrity: The system must enforce that "Suite" types only exist on the "Urban Elegance" floor as per the problem statement |

## Create Hotel Clerk Account

| Use Case Name | Create Hotel Clerk Account |
|---------------|----------------------------|
| Actor         | Admin                      |
| Author        | Jace Yarborough            |
| Preconditions | 1. Hotel system online and operational <br>2. User is logged in as an Admin|
|Postconditions | 1. A new hotel clerk account is created <br> 2. Clerk account has given username and default password (or custom password)|
|Main Success Scenerio| 1. Admin selects option to create hotel clerk account <br>2. System prompts admin to enter desired username and shows prefilled password for account.<br>3. Admin enters username and opitonal different password<br>4. System validates inpout <br> 5. System creates clerk account<br> 6. System displays success message for created account |
|Extentions| 4a. **Username already in use**<br>&nbsp;&nbsp;&nbsp;&nbsp;    4a1 System detecuts username already in use(Ex: John_Smith)<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4a2 System displays error message and potential username replacement (EX: John_Smith1)<br>5a **Failure to create account**<br>&nbsp;&nbsp;&nbsp;&nbsp; 5a1 Display error message of account creation failure<br>&nbsp;&nbsp;&nbsp;&nbsp; 5a2 Reprompt user to try creating account again.|
|Special Reqs| ● Create account in timely manner<br>● Keep log of created accounts<br> ● Keep log of which admin created account|

## Guest Registration & Authentication

| Use Case Name | Guest Registration & Authentication |
|---------------|-----------------|
| Actor         | Guest          |
| Author        | Aaron Evans    |
| Preconditions | 1. The guest has access to the hotel system portal <br>2. The guest is not currently logged into an existing account |
| Postconditions | 1. A new guest profile is created in the database <br>2. Payment information is securely tokenized/stored <br>3. The guest is automatically logged in and redirected to the dashboard <br>4. A "Welcome [Name]" message is displayed |
| Main Success Scenario | 1. The guest selects the "Register" or "Create Account" option <br>2. The guest enters personal details: Full Name, Address, Email, and Password <br>3. The guest enters payment details: Credit Card Number, Expiration Date, and CVV <br>4. The system validates the format of all fields (e.g., email syntax, credit card Luhn algorithm) <br>5. The system checks if the email address is already registered <br>6. The system encrypts the password and stores the guest profile <br>7. The system authenticates the new session <br>8. The system displays a "Welcome [Guest Name]" message on the homepage/dashboard |
| Extensions | [4]a. **Invalid Data Format**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 The system highlights the specific field (e.g., "Invalid Credit Card Format")<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 The guest corrects the data<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a3 Continue from step 4<br>[5]a. **Email Already Exists**<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a1 The system notifies the guest that an account already exists with that email<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a2 The system offers a "Forgot Password" or "Login" link<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a3 Use case ends<br>[7]a. **Authentication Failure**<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a1 The system creates the account but fails the initial login<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a2 The system redirects the guest to the manual Login page |
| Special Reqs | ● PCI Compliance: Credit card data must be handled according to security standards (e.g., masking numbers in the UI)<br>● Data Integrity: The "Welcome" message must dynamically pull the FirstName attribute from the database<br>● Persistence: Guest information must remain accessible for future "Store" purchases without re-entry |

## HelpDesk

| Use Case Name | HelpDesk |
|---------------|----------|
| Actor         | Guest    |
| Author        | James Bagwell |
| Preconditions | 1. There is a staff member on standby to help over the computer / phone <br>2. There is a staff member ready to complete the scheduled service at the time it was scheduled |
| Postconditions | 1. Guest received help they needed <br>2. Guest schedules a service and reason for scheduling |
| Main Success Scenario | 1. User logs into the hotel website and navigates to the HelpDesk menu <br>2. If they need technical help (such as Wi-Fi not working, how to use the phone, etc.), they select that option. If they need a technician or a house-keeper (for example, if the air-conditioning isn't working or the toilet is clogged), they choose the other option. <br>3. If the user selects the first option, they are able to chat on the computer with someone who can help. If they choose the second option, they can request a technician or house-keeper to fix the situation, and the system will assign and schedule someone to come help as soon as possible. <br>4. The situation is fixed. |
| Extensions | 2a. **No Virtual Technician Available**<br>&nbsp;&nbsp;&nbsp;&nbsp;2a1. No staff member is available for technical support.<br>&nbsp;&nbsp;&nbsp;&nbsp;2a2. The system displays a message notifying the yuser of a delay and it and allows the guest to submit a request to get a call back later.<br>3b. **No Technician or House-keeper Available**<br>&nbsp;&nbsp;&nbsp;&nbsp;3b1. No technician or house-keeper is available at the requested time.<br>&nbsp;&nbsp;&nbsp;&nbsp;3b2. The system prompts the guest to select an alternate time for the service request. |
| Special Reqs | ● The HelpDesk system must always be accessible through the hotel website.<br>● Live chat must occur quickly.<br>● All help requests and service schedules must be logged and associated with the guest's room number and account / phone number. |

## Make Reservation

| Use Case Name | Make Reservation |
|---------------|-----------------|
| Actor         | Hotel Guest    |
| Author        | Aaron Evans    |
| Preconditions | 1. The hotel system is functional and online <br>2. The user is logged in to the system <br>3. Room and reservation data exists in the database <br>4. The user has searched for available rooms |
| Postconditions | 1. A new reservation is created in the system <br>2. The selected room is marked as reserved for the specified dates <br>3. Guest information is recorded (name, address, credit card number, expiration date) <br>4. Confirmation is displayed to the user |
| Main Success Scenario | 1. The user selects a room from the list of available rooms <br>2. The user enters the check-in and check-out dates <br>3. The user selects the rate type (standard, promotion, group, or non-refundable) <br>4. The user enters or confirms their personal information (name, address) <br>5. The user enters payment information (credit card number, expiration date) <br>6. The system validates all input data <br>7. The system verifies room availability for the selected dates <br>8. The system calculates the total cost based on quality level and rate type <br>9. The system creates the reservation and stores it in the database <br>10. The system displays reservation confirmation with details |
| Extensions | 3a. **Corporate guest selected**<br>&nbsp;&nbsp;&nbsp;&nbsp;3a1 The user selects their corporation from the list<br>&nbsp;&nbsp;&nbsp;&nbsp;3a2 The system records the corporation for billing purposes<br>&nbsp;&nbsp;&nbsp;&nbsp;3a3 Continue from step 4<br>6a. **Invalid input data**<br>&nbsp;&nbsp;&nbsp;&nbsp;6a1 The system displays an error message indicating the invalid fields<br>&nbsp;&nbsp;&nbsp;&nbsp;6a2 The user corrects the input<br>&nbsp;&nbsp;&nbsp;&nbsp;6a3 Continue from step 6<br>7a. **Room is no longer available**<br>&nbsp;&nbsp;&nbsp;&nbsp;7a1 The system notifies the user that the room has been booked<br>&nbsp;&nbsp;&nbsp;&nbsp;7a2 The system redirects the user to search for available rooms<br>&nbsp;&nbsp;&nbsp;&nbsp;7a3 Use case ends |
| Special Reqs | ● Credit card information must be securely stored<br>● Reservation must be atomic (all or nothing) |

## Modify Reservation

| Use Case Name| Modify Reservation |
|---------------|-----------------|
| Actor         | Hotel Guest    |
| Author        | Zain Altaf     |
| Preconditions | 1. The hotel guest is logged into the system. <br>2.The guest has an existing reservation. <br> 3. The reservation has not yet started.|
|Postconditions | 1. The reservation is updated only if modification is permitted. <br> 2. If modification is not permitted, the reservation remains unchanged. <br> 3. Any change in price is recalculated and recorded. |
|Main Success Scenario| 1. The guest selects the option to view their reservations. <br>2. The system displays the guest's reservations.<br>3. The guest selects a reservation to modify.<br>4. The system displays the current reservation details <br> 5.The guest enters the requested changes (e.g., dates or room type).<br> 6. The system checks whether the modification request is more than X hours before the check-in time. <br> 7. The system checks room availability for the requested changes. <br> 8. The system recalculates the reservation cost, if applicable. <br> 9. The system displays the updated reservation details. <br> 10. The guest confirms the modification. <br> 11. The system updates the reservation. <br> 12. The system displays a modification confirmation message.|
|Extensions| [6]a. **Modification not allowed (within X hours of check-in)**<br>&nbsp;&nbsp;&nbsp;&nbsp;    [6]a1 The system determines that the modification request is within X hours of the check-in time.<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 The system displays a message explaining that modifications are not permitted according to the policy.|
|Special Reqs| ● The system must enforce the X-hour modification policy exactly.<br>● Availability checks must be consistent with current reservations.<br> ● Price recalculation must follow hotel pricing rules.|

## Process Check-In

| Use Case Name | Process Check-In |
|---------------|-----------------|
| Actor         | Hotel Clerk    |
| Author        | Erick Martinez |
| Preconditions | 1. The hotel system is functional and online <br>2. The clerk is logged in to the system <br>3. The guest has an existing reservation for the current date <br>4. At least one room matching the reservation criteria is available |
| Postconditions | 1. The guest is checked in and assigned to a specific room <br>2. The room status is updated to occupied <br>3. The check-in date and time are recorded <br>4. The guest can access hotel services (including the store) |
| Main Success Scenario | 1. The clerk searches for the guest's reservation by name or confirmation number <br>2. The system displays the reservation details <br>3. The clerk verifies the guest's identity <br>4. The clerk confirms the reservation details with the guest <br>5. The system displays available rooms matching the reservation <br>6. The clerk selects a room to assign to the guest <br>7. The system allocates the room to the guest <br>8. The system updates the room status to occupied <br>9. The system records the check-in timestamp <br>10. The clerk provides the room key/access information to the guest <br>11. The system displays check-in confirmation |
| Extensions | 1a. **Reservation not found**<br>&nbsp;&nbsp;&nbsp;&nbsp;1a1 The clerk verifies guest information<br>&nbsp;&nbsp;&nbsp;&nbsp;1a2 The clerk offers to create a new reservation (see Make Reservation use case)<br>&nbsp;&nbsp;&nbsp;&nbsp;1a3 Use case ends or continues with new reservation<br>4a. **Guest requests different room type**<br>&nbsp;&nbsp;&nbsp;&nbsp;4a1 The clerk searches for alternative available rooms<br>&nbsp;&nbsp;&nbsp;&nbsp;4a2 The system displays available alternatives with price differences<br>&nbsp;&nbsp;&nbsp;&nbsp;4a3 The guest selects a new room type<br>&nbsp;&nbsp;&nbsp;&nbsp;4a4 The system updates the reservation with new rate if applicable<br>&nbsp;&nbsp;&nbsp;&nbsp;4a5 Continue from step 5<br>6a. **No rooms available matching reservation**<br>&nbsp;&nbsp;&nbsp;&nbsp;6a1 The system notifies the clerk of the situation<br>&nbsp;&nbsp;&nbsp;&nbsp;6a2 The clerk offers an upgrade or alternative room<br>&nbsp;&nbsp;&nbsp;&nbsp;6a3 The guest accepts or declines the alternative<br>&nbsp;&nbsp;&nbsp;&nbsp;6a4 If declined, the clerk processes a cancellation with no penalty<br>&nbsp;&nbsp;&nbsp;&nbsp;6a5 Use case ends or continues with alternative room |
| Special Reqs | ● Check-in must update room availability in real-time<br>● Guest must have an active reservation to access store purchasing |

## Leaving and / or Viewing a Review

| Use Case Name | Leaving and / or Viewing a Review |
|---------------|-----------------|
| Actor         | Previous Hotel Guest / Potential Guest |
| Author        | James Bagwell |
| Preconditions | 1. The user is on the review / details page. <br>2. To leave a review, the user must be logged into their account and theyu must have reserved AND checked-in to a room previously. |
| Postconditions | 1. The new review is saved to the database and displayed on the hotel page. <br> 2. The hotel's average star rating is updated. |
| Main Success Scenario | 1. The User selects the "Reviews" tab on the hotel detail page. <br>2. The System displays a list of existing reviews and the current average rating. <br>3. The User clicks the button to leave a review. <br>4. The User leaves a star rating ( 1–5 ) and writes their review in the text field. <br> 5. The User clicks the submits the review. <br> 6. The System validates the review and indicates that the review was successfully left. |
| Extensions | 3a. **User is not logged in**<br>&nbsp;&nbsp;&nbsp;&nbsp; 3a1. The System prompts the user to log in or sign up.<br> &nbsp;&nbsp;&nbsp;&nbsp; 3a2. Upon successful login, the system redirects the user back to the review form.<br>5b. **Incomplete Review Form**<br>&nbsp;&nbsp;&nbsp;&nbsp; 5b1. The System highlights the missing fields (for example, if the star rating is left blank).<br>&nbsp;&nbsp;&nbsp;&nbsp; 5b2. The System prevents submission until all required fields are filled.|
| Special Reqs | ● The system must filter for profanity or restricted content before publishing.<br>● The user must be able to filter how many reviews they want to see ( For example, show 10 reviews ).<br> ● Users should be able to sort reviews by "Most Recent" or "Highest Rated."|

## Search Available Room

| Use Case Name | Search Available Room |
|---------------|-----------------|
| Actor         | Hotel Guest    |
| Author        | Erick Martinez |
| Preconditions | 1. The hotel system is functional and online <br>2. Room and reservation data exists in the database |
| Postconditions | 1. Available rooms are displayed to the user <br>2. Data is not modified |
| Main Success Scenario | 1. The user selects the search option <br>2. The user enters their search criteria such as check in / out date, number of guests, number of beds, bed size, etc. <br>3. System validates input <br>4. System searches for rooms that match user criteria, if available <br>5. System displays list of available rooms that match user criteria, if available |
| Extensions | |
| Special Reqs | |

---

# User Stories

## Cancel Reservation

**As a** hotel guest,
**I want to** cancel an existing reservation,
**so that** I am no longer committed to a stay I cannot make.

### Acceptance Criteria

1. I can view my existing reservations after logging in.
2. I can select a reservation to cancel.
3. The system checks the time remaining until the reservation's check-in date.
4. If cancellation is permitted, the system displays the cancellation policy and any applicable penalty.
5. I can confirm or abort the cancellation after reviewing the policy.
6. Upon confirmation, the reservation is canceled and I receive a cancellation confirmation message.
7. If the cancellation request is within the restricted time frame, the system informs me that cancellation is not permitted and the reservation remains unchanged.

### Priority
Medium

### Story Points
3

## Guest Registration & Authentication

**As a** guest,
**I want to** register an account with my personal and payment information,
**so that** I can log in and use hotel services such as booking rooms and purchasing from the store.

### Acceptance Criteria

1. I can select a "Register" or "Create Account" option from the portal.
2. I can enter my personal details (Full Name, Address, Email, Password) and payment details (Credit Card Number, Expiration Date, CVV).
3. The system validates the format of all fields (e.g., email syntax, credit card Luhn algorithm) and highlights any invalid fields.
4. If my email is already registered, the system notifies me and offers a "Forgot Password" or "Login" link.
5. Upon successful registration, I am automatically logged in and redirected to the dashboard with a "Welcome [Name]" message.
6. My payment information is securely tokenized and stored for future purchases without re-entry.

### Priority
High

### Story Points
5

## Make Reservation

**As a** hotel guest,
**I want to** reserve a room for specific dates,
**so that** I have a guaranteed room when I arrive at the hotel.

### Acceptance Criteria

1. I can select a room from the list of available rooms returned by a search.
2. I can enter check-in and check-out dates for my stay.
3. I can choose a rate type (standard, promotion, group, or non-refundable).
4. I can enter my personal information (name, address) and payment information (credit card number, expiration date).
5. The system validates all input and shows clear error messages for invalid fields.
6. The system verifies that the selected room is still available before confirming.
7. The system calculates and displays the total cost based on room quality level and rate type.
8. Upon successful booking, I receive a confirmation with the reservation details.
9. If the room is no longer available, I am notified and redirected to search again.

### Priority
High

### Story Points
5

## Modify Reservation

**As a** hotel guest,
**I want to** modify an existing reservation's dates or room type,
**so that** I can adjust my stay to fit my updated plans.

### Acceptance Criteria

1. I can view my existing reservations and select one to modify.
2. I can change the reservation dates or room type.
3. If the modification request is within X hours of check-in, the system informs me that modifications are not permitted per the hotel policy.
4. The system checks room availability for the requested changes.
5. The system recalculates the reservation cost and displays the updated details before I confirm.
6. Upon confirmation, the reservation is updated and I receive a modification confirmation message.

### Priority
Medium

### Story Points
3

## Process Check-In

**As a** hotel clerk,
**I want to** check in a guest with an existing reservation,
**so that** the guest is assigned a room and can begin their stay.

### Acceptance Criteria

1. I can search for a guest's reservation by name or confirmation number.
2. The system displays the reservation details so I can verify them with the guest.
3. The system shows available rooms that match the reservation criteria.
4. I can select a specific room to assign to the guest.
5. The system updates the room status to occupied and records the check-in timestamp.
6. If no matching rooms are available, I can offer the guest an upgrade or alternative room.
7. If the reservation is not found, I can create a new reservation for the guest.
8. After check-in, the guest can access hotel services including the store.

### Priority
High

### Story Points
5
