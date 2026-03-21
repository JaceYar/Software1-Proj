package edu.baylor.cs.dto;

public record RoomDto(
        int id,
        String roomNumber,
        int floor,
        String roomType,
        String qualityLevel,
        String bedType,
        int numBeds,
        boolean smoking,
        double dailyRate,
        String description,
        String status
) {}
