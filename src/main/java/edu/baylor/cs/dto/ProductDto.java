package edu.baylor.cs.dto;

public record ProductDto(
        int id,
        String name,
        String category,
        double price,
        int stockQuantity,
        String description
) {}
