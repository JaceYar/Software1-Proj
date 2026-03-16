| Use Case Name | Admin Login |
|---|---|
| Actor | Admin |
| Author | Jace Yarborough |
| Preconditions | 1. System operational<br>2. User has a valid admin account with username and password |
| Postconditions | 1. Admin is successfully logged in<br>2. Admin is redirected to admin dashboard/panel |
| Main Success Scenario | 1. Admin navigates to login page<br>2. Admin enters username<br>3. Admin enters password<br>4. Admin submits credentials<br>5. System validates input<br>6. System verifies credentials<br>7. System displays success message<br>8. Admin is brought to admin dashboard |
| Extensions | [4]a. **Invalid username format**<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a1 System detects username doesn't meet format requirements<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a2 System displays error message "Invalid username or password"<br>&nbsp;&nbsp;&nbsp;&nbsp;[4]a3 System prompts user to re-enter credentials<br>[6]a. **Invalid credentials**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a1 System detects username or password is incorrect<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a2 System increments failed login attempt counter<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a3 System displays error message "Invalid username or password"<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]a4 Return to step 2<br>[6]b. **Account locked**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b1 System detects account has been locked due to multiple failed attempts<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b2 System displays error message "Account locked. Contact system administrator"<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]b3 Use case ends<br>[6]c. **Password expired**<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]c1 System detects password has expired<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]c2 System prompts admin to reset password<br>&nbsp;&nbsp;&nbsp;&nbsp;[6]c3 Redirect to password reset use case |
| Special Reqs | ● Password must be hashed in database<br>● Log all login attempts |

```mermaid
sequenceDiagram
    actor Admin
    participant System

    Admin->>System: loginAdmin(username, password)
    System-->>Admin: sessionConfirmation
```

### Operation Contract

| Operation | `loginAdmin(username: String, password: String)` |
|---|---|
| Cross References | Use Case: Admin Login |
| Preconditions | 1. System is operational<br>2. An admin account with the given username exists in the system |
| Postconditions | 1. An admin session was created<br>2. Admin.isLoggedIn was set to true<br>3. The login attempt was logged |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:LoginHandler` | Use-case controller; receives the `loginAdmin` system operation |
| **Information Expert + Pure Fabrication** | `:AdminCatalog` | Holds all Admin accounts; finds by username and verifies credentials |
| **Information Expert** | `admin:Admin` | Manages its own `isLoggedIn` flag |
| **Pure Fabrication** | `:SessionStore` | Creates and stores the authenticated session |
| **Pure Fabrication** | `:AuditLog` | Logs all login attempts for auditing |

```mermaid
sequenceDiagram
    actor Admin
    participant ctrl as :LoginHandler
    participant ac as :AdminCatalog
    participant a as admin:Admin
    participant ss as :SessionStore
    participant al as :AuditLog

    Admin->>ctrl: loginAdmin(username, password)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>ac: findByUsername(username)
    activate ac
    Note right of ac: GRASP: Information Expert<br>+ Pure Fabrication
    ac-->>ctrl: admin
    deactivate ac

    ctrl->>a: verifyPassword(password)
    activate a
    Note right of a: GRASP: Information Expert<br>(Admin verifies its own credentials)
    a-->>ctrl: true
    deactivate a

    ctrl->>a: setLoggedIn(true)
    activate a
    a-->>ctrl: ok
    deactivate a

    ctrl->>ss: createSession(admin)
    activate ss
    Note right of ss: GRASP: Pure Fabrication
    ss-->>ctrl: session
    deactivate ss

    ctrl->>al: logLoginAttempt(username, success)
    activate al
    Note right of al: GRASP: Pure Fabrication
    al-->>ctrl: ok
    deactivate al

    ctrl-->>Admin: sessionConfirmation
    deactivate ctrl
```

