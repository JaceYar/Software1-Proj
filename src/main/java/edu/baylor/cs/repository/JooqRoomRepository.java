package edu.baylor.cs.repository;

import edu.baylor.cs.db.tables.records.RoomsRecord;
import edu.baylor.cs.dto.RoomDto;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static edu.baylor.cs.db.Tables.RESERVATIONS;
import static edu.baylor.cs.db.Tables.ROOMS;

@Repository
public class JooqRoomRepository implements RoomRepository {

    private final DSLContext db;

    public JooqRoomRepository(DSLContext db) {
        this.db = db;
    }

    @Override
    public List<RoomsRecord> findAll() {
        return db.selectFrom(ROOMS).fetchInto(RoomsRecord.class);
    }

    @Override
    public List<RoomsRecord> findAvailableBetween(LocalDate checkIn, LocalDate checkOut) {
        var bookedRoomIds = DSL.select(RESERVATIONS.ROOM_ID)
                .from(RESERVATIONS)
                .where(RESERVATIONS.STATUS.in("CONFIRMED", "CHECKED_IN"))
                .and(RESERVATIONS.CHECK_IN_DATE.lt(checkOut))
                .and(RESERVATIONS.CHECK_OUT_DATE.gt(checkIn));

        return db.selectFrom(ROOMS)
                .where(ROOMS.STATUS.eq("AVAILABLE"))
                .and(ROOMS.ID.notIn(bookedRoomIds))
                .fetchInto(RoomsRecord.class);
    }

    @Override
    public RoomsRecord findById(int id) {
        return db.selectFrom(ROOMS).where(ROOMS.ID.eq(id)).fetchOne();
    }

    @Override
    public RoomsRecord insert(RoomDto dto) {
        return db.insertInto(ROOMS)
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
    }

    @Override
    public void update(int id, RoomDto dto) {
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
    }

    @Override
    public Float findDailyRateById(int roomId) {
        return db.select(ROOMS.DAILY_RATE)
                .from(ROOMS)
                .where(ROOMS.ID.eq(roomId))
                .fetchOneInto(Float.class);
    }

    @Override
    public void updateStatus(int roomId, String status) {
        db.update(ROOMS)
                .set(ROOMS.STATUS, status)
                .where(ROOMS.ID.eq(roomId))
                .execute();
    }
}
