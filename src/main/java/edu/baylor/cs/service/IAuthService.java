package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.AuthResponse;
import edu.baylor.cs.dto.LoginRequest;
import edu.baylor.cs.dto.RegisterRequest;

public interface IAuthService {
    AuthResponse register(RegisterRequest req);
    AuthResponse login(LoginRequest req);
    void logout(String token);
    UsersRecord getUserFromToken(String token);
}
