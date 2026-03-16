# HelpDesk — Design Sequence Diagram

**Author:** James Bagwell
**Source Use Case:** `HelpDest.md`

## GRASP Patterns Applied

| Pattern | Applied To | Rationale |
|---|---|---|
| **Controller** | `:HelpDeskHandler` | Use-case controller; receives the `submitHelpRequest` system operation |
| **Creator** | `guest:Guest` | Domain model shows `Guest "1"--"*" HelpRequest : submits`; Guest aggregates HelpRequests |
| **Information Expert + Pure Fabrication** | `:StaffCatalog` | Holds all Staff data and knows who is currently available; no direct domain class |
| **Information Expert** | `helpRequest:HelpRequest` | Manages its own `status` and `scheduledTime` attributes |
| **Pure Fabrication** | `:ChatService` | Handles live chat session orchestration; no domain counterpart |
| **Pure Fabrication** | `:HelpRequestCatalog` | Records and persists all HelpRequests for auditing and lookup |

## Sequence Diagram

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

    alt requestType == "technical"
        ctrl->>cs: initiateChat(helpRequest, staff)
        activate cs
        Note right of cs: GRASP: Pure Fabrication<br>(manages live chat sessions)
        cs-->>ctrl: chatSession
        deactivate cs
        ctrl->>req: setStatus("in-chat")
        activate req
        req-->>ctrl: ok
        deactivate req
    else requestType == "service"
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
