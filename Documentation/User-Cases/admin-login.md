| Use Case Name | Admin Login |
|---|---|
| Actor | Admin |
| Preconditions | 1. System operational<br>2. User has a valid admin account with username and password |
| Postconditions | 1. Admin is successfully logged in<br>2. Admin is redirected to admin dashboard/panel |
| Main Success Scenario | 1. Admin navigates to login page<br>2. Admin enters username<br>3. Admin enters password<br>4. Admin submits credentials<br>5. System validates input<br>6. System verifies credentials<br>7. System displays success message<br>8. Admin is brought to admin dashboard |
| Extensions | 4a. **Invalid username format**<br>&nbsp;&nbsp;&nbsp;&nbsp;4a1 System detects username doesn't meet format requirements<br>&nbsp;&nbsp;&nbsp;&nbsp;4a2 System displays error message "Invalid username or password"<br>&nbsp;&nbsp;&nbsp;&nbsp;4a3 System prompts user to re-enter credentials<br>6a. **Invalid credentials**<br>&nbsp;&nbsp;&nbsp;&nbsp;6a1 System detects username or password is incorrect<br>&nbsp;&nbsp;&nbsp;&nbsp;6a2 System increments failed login attempt counter<br>&nbsp;&nbsp;&nbsp;&nbsp;6a3 System displays error message "Invalid username or password"<br>&nbsp;&nbsp;&nbsp;&nbsp;6a4 Return to step 2<br>6b. **Account locked**<br>&nbsp;&nbsp;&nbsp;&nbsp;6b1 System detects account has been locked due to multiple failed attempts<br>&nbsp;&nbsp;&nbsp;&nbsp;6b2 System displays error message "Account locked. Contact system administrator"<br>&nbsp;&nbsp;&nbsp;&nbsp;6b3 Use case ends<br>6c. **Password expired**<br>&nbsp;&nbsp;&nbsp;&nbsp;6c1 System detects password has expired<br>&nbsp;&nbsp;&nbsp;&nbsp;6c2 System prompts admin to reset password<br>&nbsp;&nbsp;&nbsp;&nbsp;6c3 Redirect to password reset use case |
| Special Reqs | • Password must be hashed in database<br>• Log all login attempts |

Author: Jace Yarborough
