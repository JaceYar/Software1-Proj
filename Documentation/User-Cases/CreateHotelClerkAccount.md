| Use Case Name | Create Hotel Clerk Account |
|---------------|----------------------------|
| Actor         | Admin                      |
| Preconditions | 1. Hotel system online and operational <br>2. User is logged in as an Admin|
|Postconditions | 1. A new hotel clerk account is created <br> 2. Clerk account has given username and default password (or custom password)|
|Main Success Scenerio| 1. Admin selects option to create hotel clerk account <br>2. System prompts admin to enter desired username and shows prefilled password for account.<br>3. Admin enters username and opitonal different password<br>4. System validates inpout <br> 5. System creates clerk account<br> 6. System displays success message for created account |
|Extentions| 4a. **Username already in use**<br>&nbsp;&nbsp;&nbsp;&nbsp;    4a1 System detecuts username already in use(Ex: John_Smith)<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4a2 System displays error message and potential username replacement (EX: John_Smith1)<br>5a **Failure to create account**<br>&nbsp;&nbsp;&nbsp;&nbsp; 5a1 Display error message of account creation failure<br>&nbsp;&nbsp;&nbsp;&nbsp; 5a2 Reprompt user to try creating account again.|
|Special Reqs| ● Create account in timely manner<br>● Keep log of created accounts<br> ● Keep log of which admin created account|
