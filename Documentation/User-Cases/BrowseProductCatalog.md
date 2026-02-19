| Use Case Name | Hotel Clerk Login |
|---------------|-----------------|
| Actor         | Hotel Clerk    |
| Author        | Jonathan Deiss |
| Preconditions | 1. System is operational<br>2. User has a valid hotel clerk account with a username and password |
| Postconditions | 1. Hotel clerk is successfully logged in<br>2. Clerk is redirected to the clerk dashboard |
| Main Success Scenario | 1. The clerk navigates to the login page<br>2. The clerk enters their username<br>3. The clerk enters their password<br>4. The clerk submits the credentials<br>5. The system validates the input format<br>6. The system verifies the credentials against the database<br>7. The system creates a clerk session<br>8. The system redirects the clerk to the clerk dashboard |
| Extensions | [6]a. **Invalid credentials**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 The system displays "Invalid username or password"<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 Return to step 2<br>[6]b. **Account not found**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b1 The system displays "Invalid username or password" (generic, for security)<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b2 Use case ends |
| Special Reqs | ● Passwords must be stored hashed in the database<br>● All login attempts (successful and failed) must be logged |

```mermaid
sequenceDiagram
    actor Clerk
    participant System

    Clerk->>System: Navigate to login page
    System-->>Clerk: Display login form
    Clerk->>System: Enter username and password
    Clerk->>System: Submit credentials
    System-->>Clerk: Display success message
    System-->>Clerk: Redirect to clerk dashboard
```

---

## Operation Contract

| Operation | `loginClerk(username: String, password: String)` |
|---|---|
| Cross References | Use Case: Hotel Clerk Login |
| Preconditions | 1. System is operational<br>2. A hotel clerk account with the given username exists in the system |
| Postconditions | 1. A clerk session was created<br>2. HotelClerk.isLoggedIn was set to true<br>3. The login attempt was logged |

