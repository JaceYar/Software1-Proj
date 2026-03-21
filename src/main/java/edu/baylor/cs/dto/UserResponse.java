package edu.baylor.cs.dto;

public record UserResponse(
        int id,
        String username,
        String name,
        String email,
        String role
) {}
