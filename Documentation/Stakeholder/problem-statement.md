### **Stay & Shop Reservation System**

You have been contracted to create a system that automates the reservation process for a combined store and hotel. The establishment offers a unique experience where guests can stay in comfortable rooms and also have access to an exclusive shopping experience within the same premises.

**Hotel Section:**

The establishment has a total of 3 floors with hotel rooms. Each floor has a unique theme:

 1. **Nature Retreat:** Single, double, and family rooms available. Each room has a nature-inspired design.

 2. **Urban Elegance:** Suite and deluxe rooms available. Modern and elegant room designs.

 3. **Vintage Charm:** Standard and deluxe rooms available. Rooms with a vintage touch. Each room has standard hotel features like a unique number, type of beds (single, double, queen), and smoking/non-smoking status.

\- Each room is assigned a quality level: executive level, business level, comfort level, and economy level.

\- Each room also has the following:

1.  a unique number;
2.  a certain number and type of beds (i.e., twin, full, queen, and king); and
3.  a smoking/non-smoking status.

\- Each quality level has a maximum daily rate, although the rate that a guest pays may be less (e.g., through promotion rate, group rate, or non-refundable rate). When a guest wishes to make a reservation, the travel agency asks the guest which nights they want to stay and the type of room desired. The system must verify if any room is available on those nights before allowing a reservation. The system needs to record basic information about a guest who has made a reservation: name, address, credit card number, and date of expiration. A reservation can be canceled at any time. There is no charge for cancellation if it is canceled within 2 days of the reservation date. The guest is charged 80% of the cost of a single-night stay (at the reservation rate) if the cancellation is made after 2 days from the date on which the reservation was made. A reservation can be modified at any time. When a guest checks in, a room is allocated to the guest until the guest checks out. The system must keep track of all reservations and payments made and be able to provide a summary to the hotel's manager when it is requested. Corporate guests are not directly billed; rather, the corporations they work for are billed, and payments are made sometime later.

**Store Section:** The store offers a variety of products ranging from clothing and accessories to local artisanal goods. Guests have the option to explore and shop during their stay.

### General Requirements

**Very important to keep in mind that the requirements do not include all corner cases and validations that are needed. I will just give an example of what I mean, but is part of your project to think about those cases, discuss what would be the best solution and if you have doubts, ask me. Example:** What happens if a guest who did the check out and is not longer part of the Hotel, tries to buy something?

These are the requirements of the hotel guest user:

-   The hotel guest should be able to log in to the system using a username and a password.
-   The hotel guest should be able to search for rooms available in the hotel.
-   The hotel guest should be able to make a reservation with the booking details.
-   The hotel guest should be able to cancel any reservation prior to the reservation start date.
-   The hotel guest should be able to modify their own reservation when allowed.
-   The hotel guest should be able to browse and shop for products during the stay.
-   The hotel guest should be able to add items to a shopping cart.
-   The hotel guest should be able to view and purchase selected items.
-   The hotel guest should be able to receive a combined bill for the stay and shopping.

These are the requirements of the hotel clerk user:

-   The hotel clerk should be able to log in to the system using a username and a password.
-   The hotel clerk should be able to modify their own profile information including passwords.
-   The hotel clerk should be able to enter and modify the information of all rooms.
-   The hotel clerk should be able to view the status of all the rooms in the hotel.
-   The hotel clerk should be able to modify any reservation.
-   The hotel clerk should be able to process the check-in/check-out of a guest.
-   The hotel clerk should be able to generate billing information for any guest.
-   The hotel clerk should be able to make a reservation requested by a guest.
-   The hotel clerk should be able to cancel any reservation prior to the reservation start date.

These are the requirements of the admin user:

-   The admin user should be able to log in to the system using a username and a password.
-   The admin user should be able to create a hotel clerk account which contains a username and a default password.
-   The admin user should be able to reset the user account password.

The minimum scope of full implementation (with GUIs connected) expected for Iteration 3 (Final Demo)

-   The hotel guests should be able to:
    -   Create a guest account with a username and a password.
    -   Log in to the system using a username and a password.
    -   Search for rooms available in the hotel.
    -   Make a reservation with the booking details.
    -   Cancel any reservation they made when allowed (i.e., prior to the reservation start date) with proper cancellation penalties.
    -   Modify their own reservation when allowed.
    -   Browse and shop for products during the stay.
    -   Add items to a shopping cart.
    -   View and purchase selected items.
    -   Receive a combined bill for the stay and shopping.

-   The hotel clerks should be able to:
    -   Log in to the system using a username and a password.
    -   Modify their own profile information, including passwords.
    -   Add a room and modify the information of each room. 
    -   Cancel any reservation for a guest when allowed (i.e., prior to the reservation start date) with proper cancellation penalties.

-   The admin user should be able to:
    -   Log in to the system using a username and a password.
    -   Create a hotel clerk account that contains a username and a default password.

Additional requirements expected to be implemented, at least partially connected GUIs (or at least as fully tested backend modules): 

-   The hotel clerk should be able to:
    -   View the status of all the rooms in the hotel.
    -   Process the check-in/check-out of a guest.
    -   Modify any reservation.
    -   Generate billing information for any guest.
    -   Make a reservation requested by a guest.

-   The admin user should be able to reset the user account password.

Bonus Scope/Features

-   More GUIs fully connected for the required functionality listed above.
-   Implement GUIs using web technologies (HTML/CSS + minimal backends)
-   Hotel guest membership with points earning/redeem system.
-   Mobile notification (email and/or text).
