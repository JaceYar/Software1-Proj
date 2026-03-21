| Use Case Name | HelpDesk |
|---------------|----------|
| Actor         | Guest    |
| Author        | James Bagwell |
| Preconditions | 1. There is a staff member on standby to help over the computer / phone <br>2. There is a staff member ready to complete the scheduled service at the time it was scheduled |
| Postconditions | 1. Guest received help they needed <br>2. Guest schedules a service and reason for scheduling |
| Main Success Scenario | 1. User logs into the hotel website and navigates to the HelpDesk menu <br>2. If they need technical help (such as Wi-Fi not working, how to use the phone, etc.), they select that option. If they need a technician or a house-keeper (for example, if the air-conditioning isn't working or the toilet is clogged), they choose the other option. <br>3. If the user selects the first option, they are able to chat on the computer with someone who can help. If they choose the second option, they can request a technician or house-keeper to fix the situation, and the system will assign and schedule someone to come help as soon as possible. <br>4. The situation is fixed. |
| Extensions | 2a. **No Virtual Technician Available**<br>&nbsp;&nbsp;&nbsp;&nbsp;2a1. No staff member is available for technical support.<br>&nbsp;&nbsp;&nbsp;&nbsp;2a2. The system displays a message notifying the yuser of a delay and it and allows the guest to submit a request to get a call back later.<br>3b. **No Technician or House-keeper Available**<br>&nbsp;&nbsp;&nbsp;&nbsp;3b1. No technician or house-keeper is available at the requested time.<br>&nbsp;&nbsp;&nbsp;&nbsp;3b2. The system prompts the guest to select an alternate time for the service request. |
| Special Reqs | ● The HelpDesk system must always be accessible through the hotel website.<br>● Live chat must occur quickly.<br>● All help requests and service schedules must be logged and associated with the guest's room number and account / phone number. |

```mermaid
sequenceDiagram
    actor Guest
    participant System

    Guest->>System: submitHelpRequest(requestType, description)
    System-->>Guest: helpRequestConfirmation
```

### Operation Contract

| Operation | `submitHelpRequest(requestType: String, description: String)` |
|---|---|
| Cross References | Use Case: HelpDesk |
| Preconditions | 1. Guest is logged in<br>2. A staff member is on standby<br>3. Hotel system is accessible |
| Postconditions | 1. A new HelpRequest was created and associated with the guest's account and room number<br>2. If technical help: a live chat session was initiated between the guest and an available staff member<br>3. If service request: a ServiceRequest was created, a staff member was assigned, and a service time was scheduled<br>4. Help request was logged with the guest's room number and account |

### Design Sequence Diagram

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:HelpDeskHandler` | Use-case controller; receives the `submitHelpRequest` system operation |
| **Creator** | `guest:Guest` | Domain model shows `Guest "1"--"*" HelpRequest : submits`; Guest aggregates HelpRequests |
| **Information Expert + Pure Fabrication** | `:StaffCatalog` | Holds all Staff data and knows who is currently available; no direct domain class |
| **Information Expert** | `helpRequest:HelpRequest` | Manages its own `status` and `scheduledTime` attributes |
| **Pure Fabrication** | `:ChatService` | Handles live chat session orchestration; no domain counterpart |
| **Pure Fabrication** | `:HelpRequestCatalog` | Records and persists all HelpRequests for auditing and lookup |

```mermaid
sequenceDiagram
    actor GuestActor as Guest
    participant ctrl as :HelpDeskHandler
    participant g as guest:Guest
    participant req as helpRequest:HelpRequest
    participant sc as :StaffCatalog
    participant cs as :ChatService
    participant hrc as :HelpRequestCatalog

    GuestActor->>ctrl: submitHelpRequest(requestType, description)
    activate ctrl
    Note right of ctrl: GRASP: Controller

    ctrl->>g: createHelpRequest(requestType, description)
    activate g
    Note right of g: GRASP: Creator<br>(Guest submits HelpRequests)
    g->>req: <<create>>(requestType, description)
    activate req
    g-->>ctrl: helpRequest
    deactivate g

    ctrl->>sc: findAvailableStaff(requestType)
    activate sc
    Note right of sc: GRASP: Information Expert<br>+ Pure Fabrication
    sc-->>ctrl: staff
    deactivate sc

    alt technical support request
        ctrl->>cs: initiateChat(helpRequest, staff)
        activate cs
        Note right of cs: GRASP: Pure Fabrication<br>(manages live chat sessions)
        cs-->>ctrl: chatSession
        deactivate cs
        ctrl->>req: setStatus(inChat)
        activate req
        req-->>ctrl: ok
        deactivate req
    else service request
        ctrl->>req: scheduleService(staff)
        activate req
        Note right of req: GRASP: Information Expert<br>(HelpRequest records its own<br>scheduledTime and assigned staff)
        req-->>ctrl: ok
        deactivate req
    end

    ctrl->>hrc: add(helpRequest)
    activate hrc
    Note right of hrc: GRASP: Pure Fabrication<br>(records all HelpRequests for auditing)
    hrc-->>ctrl: ok
    deactivate hrc

    deactivate req
    ctrl-->>GuestActor: helpRequestConfirmation
    deactivate ctrl
```

