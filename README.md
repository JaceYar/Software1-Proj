# Software1-Proj

# Links to Important things

[Deliverable 2](Documentation/Deliverable-2/Deliverable-2.md)


[Jira](https://csi-3471-drop-table-teams.atlassian.net/jira/software/projects/SCRUM/boards/1)


## Getting Started

We're using jOOQ. This is a useful tool that generates an ORM straight from our schema file, located in `schema.sql`. Every time you update the schema, make sure to regenerate the ORM.

### Setup

```bash
# generates new source code
./scripts/generate-db.sh

# Start the app
./scripts/run.sh
```

---

This project follows the **Maven Standard Directory Layout** to ensure consistency across development environments.

| Directory / File | Description |
| :--- | :--- |
| **`src/main/java`** | Application source code organized by package (`edu.baylor.cs`). |
| **`src/main/resources`** | Non-Java assets such as configuration files, images, or database scripts. |
| **`src/test/java`** | Unit tests and test suites (e.g., JUnit). |
| **`src/test/resources`** | Resources specifically used for testing environments. |
| **`src/site`** | Files for project site generation. |
| **`Documentation/`** | Project deliverables, requirement docs, and diagrams. |
| **`pom.xml`** | The Project Object Model file containing dependencies and build settings. |

