package edu.baylor.cs.service;

import java.util.List;
import java.util.Map;

public interface IAdminService {
    Map<String, Object> createClerk(String username, String name);
    Map<String, Object> resetPassword(String username, String newPassword);
    List<Map<String, Object>> getAllUsers();
}
