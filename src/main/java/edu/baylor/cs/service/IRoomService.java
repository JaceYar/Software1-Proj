package edu.baylor.cs.service;

import edu.baylor.cs.dto.RoomDto;

import java.util.List;

public interface IRoomService {
    List<RoomDto> getAllRooms();
    List<RoomDto> getAvailableRooms(String checkIn, String checkOut);
    RoomDto getRoom(int id);
    RoomDto createRoom(RoomDto dto);
    RoomDto updateRoom(int id, RoomDto dto);
}
