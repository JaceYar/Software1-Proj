| Use Case Name | Leaving and / or Viewing a Review |
|---------------|-----------------|
| Actor         | Previous Hotel Guest / Potential Guest |
| Author        | James Bagwell |
| Preconditions | 1. The user is on the review / details page. <br>2. To leave a review, the user must be logged into their account and theyu must have reserved AND checked-in to a room previously. |
| Postconditions | 1. The new review is saved to the database and displayed on the hotel page. <br> 2. The hotel’s average star rating is updated. |
| Main Success Scenario | 1. The User selects the "Reviews" tab on the hotel detail page. <br>2. The System displays a list of existing reviews and the current average rating. <br>3. The User clicks the button to leave a review. <br>4. The User leaves a star rating ( 1–5 ) and writes their review in the text field. <br> 5. The User clicks the submits the review. <br> 6. The System validates the review and indicates that the review was successfully left. |
| Extensions | [3]a. **User is not logged in**<br>&nbsp;&nbsp;&nbsp;&nbsp; [3]a1. The System prompts the user to log in or sign up.<br>&nbsp;&nbsp;&nbsp;&nbsp; [3]a2. Upon successful login, the system redirects the user back to the review form.<br>[5]b. **Incomplete Review Form**<br>&nbsp;&nbsp;&nbsp;&nbsp; [5]b1. The System highlights the missing fields (for example, if the star rating is left blank).<br>&nbsp;&nbsp;&nbsp;&nbsp; [5]b2. The System prevents submission until all required fields are filled.|
| Special Reqs | ● The system must filter for profanity or restricted content before publishing.<br>● The user must be able to filter how many reviews they want to see ( For example, show 10 reviews ).<br> ● Users should be able to sort reviews by "Most Recent" or "Highest Rated."|

```mermaid
sequenceDiagram
    actor User
    participant System

    User->>System: Select "Reviews" tab on hotel detail page
    System-->>User: Display reviews and current average rating
    User->>System: Click button to leave a review
    System-->>User: Display review form
    User->>System: Enter star rating (1-5) and review text
    User->>System: Submit review
    System->>System: Validate review (check required fields, filter content)
    System->>System: Save review and recalculate average rating
    System-->>User: Display success confirmation
```

---

## Operation Contract

| Operation | `submitReview(hotelId: String, starRating: Integer, reviewText: String)` |
|---|---|
| Cross References | Use Case: Leaving and / or Viewing a Review |
| Preconditions | 1. User is logged in<br>2. User has a prior completed stay (checked in) at the hotel |
| Postconditions | 1. A new Review was created and associated with the hotel<br>2. Review was associated with the Guest account<br>3. Hotel.averageStarRating was recalculated and updated<br>4. Review was stored in the database and made visible on the hotel page |

