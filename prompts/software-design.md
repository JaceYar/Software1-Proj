# Java + Spring Design Principles

This document outlines the core design principles to follow when building a Spring application. Adhere to these to produce maintainable, testable, and extensible code.

---

## SOLID

### S — Single Responsibility Principle
A class should have one reason to change. In Spring, this means separating concerns across layers:

- `@Controller` / `@RestController` — handles HTTP, delegates immediately to service
- `@Service` — contains business logic
- `@Repository` — data access only

**Violation:** A `@Service` that also constructs HTTP responses or directly executes SQL.

---

### O — Open/Closed Principle
Classes should be open for extension but closed for modification. Add new behavior without touching existing code.

In Spring, prefer strategy/template patterns and Spring's own extension points (`BeanPostProcessor`, `HandlerInterceptor`, etc.) over modifying existing classes.

```java
// Closed to modification — new payment types extend this, not modify it
public interface PaymentProcessor {
    void process(Payment payment);
}

@Service
public class StripePaymentProcessor implements PaymentProcessor { ... }

@Service
public class PayPalPaymentProcessor implements PaymentProcessor { ... }
```

---

### L — Liskov Substitution Principle
Subtypes must be substitutable for their base types without altering correctness. If you have a `List<Animal>` and substitute a `Dog`, it must behave as a valid `Animal`.

In Spring: if multiple `@Service` beans implement the same interface, each must honor the interface contract fully. Avoid implementations that throw `UnsupportedOperationException` or silently no-op on methods.

---

### I — Interface Segregation Principle
Don't force clients to depend on methods they don't use. Prefer many narrow interfaces over one wide one.

```java
// Bad — forces read-only consumers to depend on write operations
public interface UserRepository extends JpaRepository<User, Long> {
    void deleteAllInactiveUsers();
    void bulkUpdateRoles(List<Long> ids, Role role);
}

// Better — segregate by use case
public interface UserReadRepository { User findByEmail(String email); }
public interface UserWriteRepository { void save(User user); }
```

---

### D — Dependency Inversion Principle
High-level modules should not depend on low-level modules. Both should depend on abstractions.

Spring's DI container embodies this. Always inject interfaces, not concrete classes.

```java
// Bad
private final StripePaymentProcessor processor; // concrete dependency

// Good
private final PaymentProcessor processor; // depends on abstraction
```

Prefer constructor injection — it makes dependencies explicit and enables immutability.

```java
@Service
public class OrderService {
    private final PaymentProcessor paymentProcessor;
    private final OrderRepository orderRepository;

    public OrderService(PaymentProcessor paymentProcessor, OrderRepository orderRepository) {
        this.paymentProcessor = paymentProcessor;
        this.orderRepository = orderRepository;
    }
}
```

---

## GRASP

GRASP (General Responsibility Assignment Software Patterns) provides heuristics for deciding *which class* should own a given responsibility.

### 1. Information Expert
Assign a responsibility to the class that has the data needed to fulfill it.

```java
// Sale owns lineItems, so it calculates the total — not an external utility class
public class Sale {
    private List<LineItem> lineItems;

    public BigDecimal getTotal() {
        return lineItems.stream()
            .map(LineItem::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

---

### 2. Creator
Assign object creation to the class that records, closely uses, or has the initialization data for objects of that type.

```java
// Order has all the data needed to create a LineItem, so it creates it
public class Order {
    public LineItem addItem(Product product, int quantity) {
        LineItem item = new LineItem(product, quantity);
        this.lineItems.add(item);
        return item;
    }
}
```

In Spring, factories and builders (`@Bean` methods, builder pattern) are the natural application of this.

---

### 3. Low Coupling
Minimize dependencies between classes. A class that depends on many others is fragile — changes ripple widely.

Prefer:
- Injecting interfaces, not concrete types
- Domain events (`ApplicationEvent`) over direct cross-service calls
- Keeping `@Service` beans from directly referencing unrelated services

---

### 4. High Cohesion
A class should do one thing well. Low cohesion is a symptom of violating SRP.

```
// Bad — Order does everything
Order
 ├─ calculateTotal()
 ├─ saveToDatabase()
 └─ renderInvoicePdf()

// Good — responsibilities are separated
Order              (domain logic)
OrderRepository    (persistence)
InvoiceService     (PDF generation)
```

---

### 5. Polymorphism
When behavior varies by type, use polymorphism instead of `if/switch` chains.

```java
// Bad
if (payment.getType() == PaymentType.CREDIT) { ... }
else if (payment.getType() == PaymentType.PAYPAL) { ... }

// Good
payment.authorize(); // dispatches to the correct implementation
```

Spring's `@Qualifier` and collections of beans make this easy to manage:

```java
// Inject all implementations and select at runtime
private final Map<String, PaymentProcessor> processors;
processors.get(payment.getType().name()).authorize(payment);
```

---

### 6. Pure Fabrication
If assigning a responsibility to a real domain class causes high coupling or low cohesion, create a non-domain helper class for it.

Examples: `PersistenceService`, `TokenValidator`, `EmailDispatcher`. These don't represent real-world entities — they exist only to keep the design clean. Most Spring `@Service` and `@Component` classes that have no domain equivalent are Pure Fabrications.

---

## DRY — Don't Repeat Yourself

Every piece of knowledge should have a single, authoritative representation in the codebase. Duplication means two places to update when requirements change, which inevitably leads to divergence.

### Common violations and fixes in Spring

**Duplicated query logic** → extract to a `@Repository` method or use Spring Data specifications/criteria.

**Duplicated validation** → use Bean Validation annotations (`@NotNull`, `@Size`, custom `@Constraint`) on DTOs rather than repeating validation logic in multiple service methods.

**Duplicated mapping (entity ↔ DTO)** → centralize in a dedicated mapper class or use MapStruct. Never scatter `new UserDto(user.getName(), ...)` across multiple services.

**Duplicated exception handling** → use `@ControllerAdvice` / `@RestControllerAdvice` as a single place for error translation.

**Duplicated configuration** → externalize to `application.yml` and bind with `@ConfigurationProperties`.

```java
@ConfigurationProperties(prefix = "payment")
public record PaymentConfig(String apiKey, Duration timeout, String webhookSecret) {}
```

---

## Testing

### Test Types and When to Use Them

**Unit tests** — test a single class in isolation. Mock all dependencies. The vast majority of your tests should be here; they're fast and pinpoint failures precisely.

**Integration tests** — test the interaction between layers (e.g., service + real database). Use sparingly — they're slow and brittle if overused. In Spring, `@SpringBootTest` or slice annotations (`@DataJpaTest`, `@WebMvcTest`) load a limited context.

**End-to-end tests** — test the full HTTP stack. Use only for critical paths.

---

### Unit Testing with JUnit 5 + Mockito

Keep unit tests focused: one logical behavior per test, arrange/act/assert structure, and descriptive names that read as sentences.

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentProcessor paymentProcessor;

    @InjectMocks
    private OrderService orderService;

    @Test
    void placeOrder_chargesPaymentAndPersistsOrder() {
        Order order = new Order(...);
        when(orderRepository.save(any())).thenReturn(order);

        orderService.placeOrder(order);

        verify(paymentProcessor).authorize(order.getPayment());
        verify(orderRepository).save(order);
    }

    @Test
    void placeOrder_throwsWhenPaymentFails() {
        doThrow(new PaymentException("declined"))
            .when(paymentProcessor).authorize(any());

        assertThrows(PaymentException.class, () -> orderService.placeOrder(new Order(...)));
        verifyNoInteractions(orderRepository);
    }
}
```

**Rules of thumb:**
- Never use `@SpringBootTest` for unit tests — it loads the entire context and adds seconds per test.
- Prefer `@ExtendWith(MockitoExtension.class)` over `@RunWith(MockitoJUnitRunner.class)` (JUnit 5).
- Avoid mocking value objects and domain classes. Only mock dependencies that reach outside the unit (I/O, network, other services).
- Assert on behavior (what was called, what was returned), not on implementation details (internal field values).

---

### Testing Spring MVC Controllers

Use `@WebMvcTest` to test the HTTP layer in isolation. It loads only the controller, filters, and MVC config — not the full context. Mock the service layer.

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Test
    void getOrder_returns200WithOrderDto() throws Exception {
        when(orderService.findById(42L)).thenReturn(new OrderDto(42L, "PENDING"));

        mockMvc.perform(get("/orders/42").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(42))
            .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void getOrder_returns404WhenNotFound() throws Exception {
        when(orderService.findById(99L)).thenThrow(new OrderNotFoundException(99L));

        mockMvc.perform(get("/orders/99"))
            .andExpect(status().isNotFound());
    }
}
```

---

### Testing the Database Layer with jOOQ

jOOQ generates typesafe SQL through a `DSLContext`. The right strategy depends on what you're testing.

#### Option 1: Mock `DSLContext` (pure unit test)

Use this when testing repository logic that is straightforward enough to verify via mock assertions — e.g., that the correct table and conditions are used without needing to execute real SQL.

jOOQ's query DSL returns a chain of intermediate objects (`SelectWhereStep`, `SelectConditionStep`, etc.), so you need to mock the full chain. This gets verbose quickly and is fragile when query structure changes. **Prefer option 2 for anything non-trivial.**

```java
@ExtendWith(MockitoExtension.class)
class UserRepositoryTest {

    @Mock
    private DSLContext dsl;

    @InjectMocks
    private UserRepository userRepository;

    @Test
    void findByEmail_delegatesToDsl() {
        // Mocking the jOOQ chain
        var selectFrom = mock(SelectWhereStep.class);
        var selectWhere = mock(SelectConditionStep.class);

        when(dsl.selectFrom(USERS)).thenReturn(selectFrom);
        when(selectFrom.where(USERS.EMAIL.eq("a@b.com"))).thenReturn(selectWhere);
        when(selectWhere.fetchOneInto(User.class)).thenReturn(new User(1L, "a@b.com"));

        User result = userRepository.findByEmail("a@b.com");

        assertThat(result.email()).isEqualTo("a@b.com");
    }
}
```

#### Option 2: Embedded database (recommended for repository tests)

Run queries against a real embedded database. This tests actual SQL correctness, not just that you called the right mock method. Use H2 in MySQL/PostgreSQL compatibility mode, or use Testcontainers for an exact replica of your production database.

**With H2 (fast, no Docker required):**

```xml
<!-- pom.xml test scope -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

```yaml
# src/test/resources/application-test.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE
    driver-class-name: org.h2.Driver
```

```java
@SpringBootTest
@ActiveProfiles("test")
@Transactional  // rolls back after each test — no cleanup needed
class UserRepositoryIntegrationTest {

    @Autowired
    private DSLContext dsl;

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByEmail_returnsUserWhenExists() {
        dsl.insertInto(USERS)
            .set(USERS.ID, 1L)
            .set(USERS.EMAIL, "test@example.com")
            .execute();

        User user = userRepository.findByEmail("test@example.com");

        assertThat(user).isNotNull();
        assertThat(user.email()).isEqualTo("test@example.com");
    }
}
```

**With Testcontainers (exact production parity):**

Testcontainers spins up a real PostgreSQL (or whichever DB you use) in Docker. Use this when H2 compatibility gaps cause issues or when you need to test DB-specific features (window functions, CTEs, custom types, etc.).

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
```

```java
@SpringBootTest
@Testcontainers
class UserRepositoryContainerTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DSLContext dsl;

    @Test
    void findByEmail_returnsUserWhenExists() {
        dsl.insertInto(USERS)
            .set(USERS.ID, 1L)
            .set(USERS.EMAIL, "test@example.com")
            .execute();

        User user = userRepository.findByEmail("test@example.com");

        assertThat(user.email()).isEqualTo("test@example.com");
    }
}
```

Use `@Container` as `static` so the container is shared across all tests in the class — startup cost is paid once. For sharing across multiple test classes, use a base class or a shared container singleton.

---

### General Testing Principles

**Test behavior, not implementation.** Tests should describe *what* the system does from the outside, not *how* it does it internally. Tests that break when you rename a private method are testing the wrong thing.

**One assertion per logical behavior.** Multiple `assertThat` calls on the result of a single action are fine. Multiple distinct behaviors in one test obscure which one failed.

**Don't use `@SpringBootTest` when a slice test will do.** Loading the full context for a controller test that only needs `@WebMvcTest` adds 5–30 seconds per test run for no benefit.

**Use `@Transactional` on integration tests** to roll back database state between tests instead of writing teardown logic.

**Keep test data minimal.** Only insert the rows your test actually needs. Tests that require 20 rows of setup to test one query are testing setup, not the query.

**Name tests as sentences:** `methodName_expectedBehavior_whenCondition` or plain English. A test named `test1` tells you nothing when it fails in CI.

---

## Summary

| Principle | Key Question |
|-----------|-------------|
| SRP | Does this class have more than one reason to change? |
| OCP | Can I add behavior without modifying existing code? |
| LSP | Are all implementations of this interface truly substitutable? |
| ISP | Does this interface have methods some implementors don't need? |
| DIP | Am I depending on a concrete class instead of an abstraction? |
| Information Expert | Does the class responsible for this task actually own the data? |
| Creator | Does the creating class record, use, or initialize objects of this type? |
| Low Coupling | Will a change here force changes in many other classes? |
| High Cohesion | Does this class do one clearly-defined thing? |
| Polymorphism | Am I branching on type instead of dispatching through an interface? |
| Pure Fabrication | Should I introduce a non-domain class to keep real domain classes clean? |
| DRY | Is this logic or knowledge defined in more than one place? |
