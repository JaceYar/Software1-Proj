package edu.baylor.cs.repository;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.RegisterRequest;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

import static edu.baylor.cs.db.Tables.USERS;

@Repository
public class JooqUserRepository implements UserRepository {

    private final DSLContext db;

    public JooqUserRepository(DSLContext db) {
        this.db = db;
    }

    @Override
    public boolean existsByUsername(String username) {
        return db.fetchExists(USERS, USERS.USERNAME.eq(username));
    }

    @Override
    public UsersRecord findByUsername(String username) {
        return db.selectFrom(USERS).where(USERS.USERNAME.eq(username)).fetchOne();
    }

    @Override
    public UsersRecord findById(int id) {
        return db.selectFrom(USERS).where(USERS.ID.eq(id)).fetchOne();
    }

    @Override
    public UsersRecord insertGuest(RegisterRequest req, String passwordHash) {
        return db.insertInto(USERS)
                .set(USERS.USERNAME, req.username())
                .set(USERS.PASSWORD_HASH, passwordHash)
                .set(USERS.NAME, req.name())
                .set(USERS.EMAIL, req.email())
                .set(USERS.ADDRESS, req.address())
                .set(USERS.CREDIT_CARD_NUMBER, req.creditCardNumber())
                .set(USERS.CREDIT_CARD_EXPIRY, req.creditCardExpiry())
                .set(USERS.ROLE, "GUEST")
                .returning()
                .fetchOne();
    }

    @Override
    public void insertClerk(String username, String passwordHash, String name) {
        db.insertInto(USERS)
                .set(USERS.USERNAME, username)
                .set(USERS.PASSWORD_HASH, passwordHash)
                .set(USERS.NAME, name)
                .set(USERS.ROLE, "CLERK")
                .execute();
    }

    @Override
    public int updatePasswordHash(String username, String newHash) {
        return db.update(USERS)
                .set(USERS.PASSWORD_HASH, newHash)
                .where(USERS.USERNAME.eq(username))
                .execute();
    }

    @Override
    public List<Map<String, Object>> findAllSummary() {
        return db.select(USERS.ID, USERS.USERNAME, USERS.NAME, USERS.EMAIL, USERS.ROLE, USERS.CREATED_AT)
                .from(USERS)
                .fetch(r -> Map.of(
                        "id", r.get(USERS.ID),
                        "username", r.get(USERS.USERNAME),
                        "name", r.get(USERS.NAME),
                        "email", r.get(USERS.EMAIL) != null ? r.get(USERS.EMAIL) : "",
                        "role", r.get(USERS.ROLE)
                ));
    }
}
