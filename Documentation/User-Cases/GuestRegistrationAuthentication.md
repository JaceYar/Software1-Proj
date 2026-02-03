## Section	Details
## Use Case Name	Guest Registration & Authentication
## Actor	Guest
## Preconditions
1. The guest has access to the hotel system portal.
2. The guest is not currently logged into an existing account.

## Postconditions	
1. A new guest profile is created in the database.
2. Payment information is securely tokenized/stored.
3. The guest is automatically logged in and redirected to the dashboard.
4. A "Welcome [Name]" message is displayed.

## Main Success Scenario	
1. The guest selects the "Register" or "Create Account" option.
2. The guest enters personal details: Full Name, Address, Email, and Password.
3. The guest enters payment details: Credit Card Number, Expiration Date, and CVV.
4. The system validates the format of all fields (e.g., email syntax, credit card Luhn algorithm).
5. The system checks if the email address is already registered.
6. The system encrypts the password and stores the guest profile.
7. The system authenticates the new session.
8. The system displays a "Welcome [Guest Name]" message on the homepage/dashboard.

## Extensions	
[4]a. Invalid Data Format:
1. The system highlights the specific field (e.g., "Invalid Credit Card Format").
2. The guest corrects the data.
3. Continue from step 4.

[5]a. Email Already Exists:
1. The system notifies the guest that an account already exists with that email.
2. The system offers a "Forgot Password" or "Login" link.
3. Use case ends.


[7]a. Authentication Failure:
1. The system creates the account but fails the initial login.
2. The system redirects the guest to the manual Login page.
Special Reqs	

● PCI Compliance: Credit card data must be handled according to security standards (e.g., masking numbers in the UI).
● Data Integrity: The "Welcome" message must dynamically pull the FirstName attribute from the database.
● Persistence: Guest information must remain accessible for future "Store" purchases without re-entry.
