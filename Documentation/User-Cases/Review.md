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

    User->>System: getReviews(hotelId)
    System-->>User: reviewList
    User->>System: submitReview(hotelId, starRating, reviewText)
    System-->>User: submissionConfirmation
```

### Operation Contract

| Operation | `submitReview(hotelId: String, starRating: Integer, reviewText: String)` |
|---|---|
| Cross References | Use Case: Leaving and / or Viewing a Review |
| Preconditions | 1. User is logged in<br>2. User has a prior completed stay (checked in) at the hotel |
| Postconditions | 1. A new Review was created and associated with the hotel<br>2. Review was associated with the Guest account<br>3. Hotel.averageStarRating was recalculated and updated<br>4. Review was stored in the database and made visible on the hotel page |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:ReviewHandler` | Use-case controller; handles both system operations for this use case session |
| **Information Expert + Pure Fabrication** | `:ReviewCatalog` | Holds all Review data; retrieves reviews by hotel and recalculates average rating |
| **Information Expert + Pure Fabrication** | `:GuestCatalog` | Retrieves the current guest from the active session |
| **Creator** | `guest:Guest` | Domain model shows `Guest "1"--"*" Review : writes`; Guest aggregates Reviews |

```mermaid
sequenceDiagram
    actor User
    participant ctrl as :ReviewHandler
    participant rcat as :ReviewCatalog
    participant gc as :GuestCatalog
    participant g as guest:Guest
    participant rev as review:Review

    Note over User,rcat: [1] getReviews(hotelId)
    User->>ctrl: getReviews(hotelId)
    activate ctrl
    Note right of ctrl: GRASP: Controller
    ctrl->>rcat: getByHotel(hotelId)
    activate rcat
    Note right of rcat: GRASP: Information Expert<br>+ Pure Fabrication
    rcat-->>ctrl: reviewList
    deactivate rcat
    ctrl-->>User: reviewList
    deactivate ctrl

    Note over User,rev: [2] submitReview(hotelId, starRating, reviewText)
    User->>ctrl: submitReview(hotelId, starRating, reviewText)
    activate ctrl

    ctrl->>gc: getCurrentGuest(guestId)
    activate gc
    Note right of gc: GRASP: Information Expert<br>+ Pure Fabrication
    gc-->>ctrl: guest
    deactivate gc

    ctrl->>g: writeReview(hotelId, starRating, reviewText)
    activate g
    Note right of g: GRASP: Creator<br>(Guest "1"--"*" Review : writes)
    g->>rev: <<create>>(hotelId, starRating, reviewText)
    activate rev
    g-->>ctrl: review
    deactivate g

    ctrl->>rcat: add(review)
    activate rcat
    rcat-->>ctrl: ok
    deactivate rcat

    ctrl->>rcat: updateAverageRating(hotelId)
    activate rcat
    Note right of rcat: GRASP: Information Expert<br>(ReviewCatalog knows all ratings<br>for a hotel)
    rcat-->>ctrl: ok
    deactivate rcat

    deactivate rev
    ctrl-->>User: submissionConfirmation
    deactivate ctrl
```

