package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.RoomsRecord;
import edu.baylor.cs.dto.RoomDto;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static edu.baylor.cs.db.Tables.RESERVATIONS;
import static edu.baylor.cs.db.Tables.ROOMS;

/**
 * Manages hotel room inventory and availability checks.
 */
@Service
public class RoomService {

    private final DSLContext db;

    public RoomService(DSLContext db) {
        this.db = db;
    }

    /** Returns all rooms. */
    public List<RoomDto> getAllRooms() {
        return db.selectFrom(ROOMS).fetch(this::toDto);
    }

    /**
     * Returns rooms available between the given dates (no overlapping CONFIRMED/CHECKED_IN reservation).
     * @param checkIn  ISO date string (YYYY-MM-DD)
     * @param checkOut ISO date string (YYYY-MM-DD)
     */
    public List<RoomDto> getAvailableRooms(String checkIn, String checkOut) {
        LocalDate in = LocalDate.parse(checkIn);
        LocalDate out = LocalDate.parse(checkOut);

        var bookedRoomIds = DSL.select(RESERVATIONS.ROOM_ID)
                .from(RESERVATIONS)
                .where(RESERVATIONS.STATUS.in("CONFIRMED", "CHECKED_IN"))
                .and(RESERVATIONS.CHECK_IN_DATE.lt(out))
                .and(RESERVATIONS.CHECK_OUT_DATE.gt(in));

        return db.selectFrom(ROOMS)
                .where(ROOMS.STATUS.eq("AVAILABLE"))
                .and(ROOMS.ID.notIn(bookedRoomIds))
                .fetch(this::toDto);
    }

    /** Returns a single room by id. */
    public RoomDto getRoom(int id) {
        RoomsRecord r = db.selectFrom(ROOMS).where(ROOMS.ID.eq(id)).fetchOne();
        if (r == null) throw new IllegalArgumentException("Room not found");
        return toDto(r);
    }

    /** Creates a new room (clerk/admin only). */
    public RoomDto createRoom(RoomDto dto) {
        RoomsRecord r = db.insertInto(ROOMS)
                .set(ROOMS.ROOM_NUMBER, dto.roomNumber())
                .set(ROOMS.FLOOR, dto.floor())
                .set(ROOMS.ROOM_TYPE, dto.roomType())
                .set(ROOMS.QUALITY_LEVEL, dto.qualityLevel())
                .set(ROOMS.BED_TYPE, dto.bedType())
                .set(ROOMS.NUM_BEDS, dto.numBeds())
                .set(ROOMS.SMOKING, dto.smoking() ? 1 : 0)
                .set(ROOMS.DAILY_RATE, (float) dto.dailyRate())
                .set(ROOMS.DESCRIPTION, dto.description())
                .set(ROOMS.STATUS, "AVAILABLE")
                .returning()
                .fetchOne();
        return toDto(r);
    }

    /** Updates room info (clerk/admin only). */
    public RoomDto updateRoom(int id, RoomDto dto) {
        db.update(ROOMS)
                .set(ROOMS.ROOM_NUMBER, dto.roomNumber())
                .set(ROOMS.FLOOR, dto.floor())
                .set(ROOMS.ROOM_TYPE, dto.roomType())
                .set(ROOMS.QUALITY_LEVEL, dto.qualityLevel())
                .set(ROOMS.BED_TYPE, dto.bedType())
                .set(ROOMS.NUM_BEDS, dto.numBeds())
                .set(ROOMS.SMOKING, dto.smoking() ? 1 : 0)
                .set(ROOMS.DAILY_RATE, (float) dto.dailyRate())
                .set(ROOMS.DESCRIPTION, dto.description())
                .set(ROOMS.STATUS, dto.status())
                .where(ROOMS.ID.eq(id))
                .execute();
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
