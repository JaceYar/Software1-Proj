package edu.baylor.cs.repository;

import edu.baylor.cs.db.tables.records.RoomsRecord;
import edu.baylor.cs.dto.RoomDto;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository {
    List<RoomsRecord> findAll();
    List<RoomsRecord> findAvailableBetween(LocalDate checkIn, LocalDate checkOut);
    RoomsRecord findById(int id);
    RoomsRecord insert(RoomDto dto);
    void update(int id, RoomDto dto);
    Float findDailyRateById(int roomId);
    void updateStatus(int roomId, String status);
}
