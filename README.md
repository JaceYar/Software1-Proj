# Software1-Proj

# Links to Important things
[Iteration 1 Presentation](https://docs.google.com/presentation/d/1XgAxJA99X4LI3pehg47F-dqAIvkeNirDLHARpfGjdOs/edit?usp=sharing)

[Deliverable 2](Documentation/Deliverable-2/Deliverable-2.md)


[Jira](https://csi-3471-drop-table-teams.atlassian.net/jira/software/projects/SCRUM/boards/1)

**Group Proj Website** : [Group Website](https://software1-proj.vercel.app/)

**Hotel Website** : [Hotel](https://hotel.aarondevelop.com/)
## Getting Started

Follow these steps to set up your local development environment after cloning the repository.

### Prerequisites

- **Java 17** or higher
- **Maven** (for the backend)
- **Bun** (for the frontend)
- **SQLite3** (for the database)

### Setup & Run

1.  **Initialize the Database and jOOQ Classes**:
    The project uses jOOQ to generate an ORM from `schema.sql`. You must run this script once after cloning (and whenever you update the schema):
    ```bash
    ./scripts/generate-db.sh
    ```

2.  **Run the Backend**:
    In a new terminal window:
    ```bash
    mvn spring-boot:run
    ```
    The backend API will be available at `http://localhost:8080`.

3.  **Run the Frontend**:
    In another terminal window:
    ```bash
    cd frontend
    bun install  # First time setup
    bun run dev
    ```
    The frontend will be available at `http://localhost:5173`.

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
