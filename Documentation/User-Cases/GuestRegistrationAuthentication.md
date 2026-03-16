| Use Case Name | Guest Registration & Authentication |
|---------------|-----------------|
| Actor         | Guest           |
| Author        | Erick Martinez  |
| Preconditions | 1. The guest has access to the hotel system portal <br>2. The guest is not currently logged into an existing account |
| Postconditions | 1. A new guest profile is created in the database <br>2. Payment information is securely tokenized/stored <br>3. The guest is automatically logged in and redirected to the dashboard <br>4. A "Welcome [Name]" message is displayed |
| Main Success Scenario | 1. The guest selects the "Register" or "Create Account" option <br>2. The guest enters personal details: Full Name, Address, Email, and Password <br>3. The guest enters payment details: Credit Card Number, Expiration Date, and CVV <br>4. The system validates the format of all fields (e.g., email syntax, credit card) <br>5. The system checks if the email address is already registered <br>6. The system encrypts the password and stores the guest profile <br>7. The system authenticates the new session <br>8. The system displays a "Welcome [Guest Name]" message on the homepage/dashboard |
| Extensions | [4]a. **Invalid Data Format**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 The system highlights the specific field (e.g., "Invalid Credit Card Format")<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 The guest corrects the data<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a3 Continue from step 4<br>[5]a. **Email Already Exists**<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a1 The system notifies the guest that an account already exists with that email<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a2 The system offers a "Forgot Password" or "Login" link<br>&nbsp;&nbsp;&nbsp;&nbsp;[5]a3 Use case ends<br>[7]a. **Authentication Failure**<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a1 The system creates the account but fails the initial login<br>&nbsp;&nbsp;&nbsp;&nbsp;[7]a2 The system redirects the guest to the manual Login page |
| Special Reqs | ● PCI Compliance: Credit card data must be handled according to security standards (e.g., masking numbers in the UI)<br>● Data Integrity: The "Welcome" message must dynamically pull the FirstName attribute from the database<br>● Persistence: Guest information must remain accessible for future "Store" purchases without re-entry |

```mermaid
sequenceDiagram
    actor Guest
    participant System

    Guest->>System: registerGuest(fullName, address, email, password, paymentInfo)
    System-->>Guest: sessionConfirmation
```

### Operation Contract

| Operation | `registerGuest(fullName: String, address: String, email: String, password: String, paymentInfo: PaymentInfo)` |
|---|---|
| Cross References | Use Case: Guest Registration & Authentication |
| Preconditions | 1. Guest has access to the hotel system portal<br>2. Guest is not currently logged in<br>3. The given email address is not already registered |
| Postconditions | 1. A new Guest profile was created in the database<br>2. Guest.password was encrypted and stored<br>3. Payment information was securely tokenized and stored<br>4. A new authenticated session was created and associated with the guest |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:RegistrationHandler` | Use-case controller; receives the `registerGuest` system operation |
| **Information Expert + Pure Fabrication** | `:GuestCatalog` | Knows all registered emails; checks uniqueness before creation |
| **Creator** | `:GuestCatalog` | Records Guest instances (GRASP Creator: B records A → B creates A) |
| **Information Expert** | `guest:Guest` | Manages its own password encryption |
| **Pure Fabrication** | `:PaymentTokenizer` | Tokenizes payment info for PCI compliance; no domain counterpart |
| **Pure Fabrication** | `:SessionStore` | Creates and stores the authenticated session |

```mermaid
sequenceDiagram
    actor Guest
    participant ctrl as :RegistrationHandler
    participant gc as :GuestCatalog
    participant g as guest:Guest
    participant pt as :PaymentTokenizer
    participant ss as :SessionStore

    Guest->>ctrl: registerGuest(fullName, address, email, password, paymentInfo)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>gc: isEmailAvailable(email)
    activate gc
    Note right of gc: GRASP: Information Expert<br>(GuestCatalog knows all emails)
    gc-->>ctrl: true
    deactivate gc

    ctrl->>pt: tokenize(paymentInfo)
    activate pt
    Note right of pt: GRASP: Pure Fabrication<br>(PCI-compliant payment tokenization)
    pt-->>ctrl: paymentToken
    deactivate pt

    ctrl->>gc: createGuest(fullName, address, email, password, paymentToken)
    activate gc
    Note right of gc: GRASP: Creator<br>(GuestCatalog records Guest instances)
    gc->>g: <<create>>(fullName, address, email, password, paymentToken)
    activate g
    g->>g: encryptPassword(password)
    Note right of g: GRASP: Information Expert<br>(Guest manages its own credentials)
    gc-->>ctrl: guest
    deactivate g
    deactivate gc

    ctrl->>ss: createSession(guest)
    activate ss
    Note right of ss: GRASP: Pure Fabrication
    ss-->>ctrl: session
    deactivate ss

    ctrl-->>Guest: sessionConfirmation
    deactivate ctrl
```

