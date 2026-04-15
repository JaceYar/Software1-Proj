

# Iteration Twelve

## Overview
- Database Choice: SQLite file
- Database Modeling: We use jOOQ to define the schema and query the database. This allows for typesafe queries. Of course, our actual controllers interact with repository objects to reduce coupling and increase cohesion.
- Current status: All implementation and testing complete. 
- Roadblocks: None. Currently working on deployment

## Diagram

```mermaid
flowchart TB
  %% Architectural layers (Larman-style package/layer view)
  subgraph Presentation["Presentation Layer"]
    C["edu.baylor.cs.controller"]
    CFG["edu.baylor.cs.config"]
    U["edu.baylor.cs.util"]
  end

  subgraph Application["Application / Service Layer"]
    S["edu.baylor.cs.service\n(interfaces + implementations)"]
  end

  subgraph Domain["Domain & Data Contract Layer"]
    D["edu.baylor.cs.dto"]
    M["edu.baylor.cs.model"]
    M2["edu.baylor.cs.models"]
  end

  subgraph Infrastructure["Infrastructure / Persistence Layer"]
    R["edu.baylor.cs.repository\n(ports + jOOQ adapters)"]
    DB["edu.baylor.cs.db\n(generated jOOQ schema/tables/records)"]
  end

  APP["edu.baylor.cs.Application"]

  APP --> C
  APP --> CFG
  C --> S
  C --> D
  C --> U
  C -. token/user lookup .-> DB

  S --> R
  S --> D
  S --> DB

  R --> DB
  R --> D

  D --> M
  D --> M2
```
