package edu.baylor.cs.repository;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.RegisterRequest;

import java.util.List;
import java.util.Map;

public interface UserRepository {
    boolean existsByUsername(String username);
    UsersRecord findByUsername(String username);
    UsersRecord findById(int id);
    UsersRecord insertGuest(RegisterRequest req, String passwordHash);
    void insertClerk(String username, String passwordHash, String name);
    int updatePasswordHash(String username, String newHash);
    List<Map<String, Object>> findAllSummary();
}
