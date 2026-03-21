package edu.baylor.cs.dto;

public record RegisterRequest(
        String username,
        String password,
        String name,
        String email,
        String address,
        String creditCardNumber,
        String creditCardExpiry
) {}
