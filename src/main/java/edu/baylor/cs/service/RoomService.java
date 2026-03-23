package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.RoomsRecord;
import edu.baylor.cs.dto.RoomDto;
import edu.baylor.cs.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Manages hotel room inventory and availability checks.
 */
@Service
public class RoomService implements IRoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    /** Returns all rooms. */
    @Override
    public List<RoomDto> getAllRooms() {
        return roomRepository.findAll().stream().map(this::toDto).toList();
    }

    /**
     * Returns rooms available between the given dates (no overlapping CONFIRMED/CHECKED_IN reservation).
     * @param checkIn  ISO date string (YYYY-MM-DD)
     * @param checkOut ISO date string (YYYY-MM-DD)
     */
    @Override
    public List<RoomDto> getAvailableRooms(String checkIn, String checkOut) {
        LocalDate in = LocalDate.parse(checkIn);
        LocalDate out = LocalDate.parse(checkOut);
        return roomRepository.findAvailableBetween(in, out).stream().map(this::toDto).toList();
    }

    /** Returns a single room by id. */
    @Override
    public RoomDto getRoom(int id) {
        RoomsRecord r = roomRepository.findById(id);
        if (r == null) throw new IllegalArgumentException("Room not found");
        return toDto(r);
    }

    /** Creates a new room (clerk/admin only). */
    @Override
    public RoomDto createRoom(RoomDto dto) {
        return toDto(roomRepository.insert(dto));
    }

    /** Updates room info (clerk/admin only). */
    @Override
    public RoomDto updateRoom(int id, RoomDto dto) {
        roomRepository.update(id, dto);
        return getRoom(id);
    }

    // -------------------------------------------------------------------------

    private RoomDto toDto(RoomsRecord r) {
        return new RoomDto(
                r.getId(), r.getRoomNumber(), r.getFloor(),
                r.getRoomType(), r.getQualityLevel(), r.getBedType(),
                r.getNumBeds(), r.getSmoking() == 1,
                r.getDailyRate(), r.getDescription(), r.getStatus()
        );
    }
}
