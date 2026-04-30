package edu.baylor.cs.dto;

public record ChangePasswordRequest(String oldPassword, String newPassword) {}
