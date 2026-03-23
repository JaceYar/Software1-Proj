package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.RoomsRecord;
import edu.baylor.cs.dto.RoomDto;
import edu.baylor.cs.repository.RoomRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class RoomServiceTest {

    @Mock
    RoomRepository roomRepository;

    @InjectMocks
    RoomService roomService;

    private RoomsRecord mockRoom(int id, String number) {
        RoomsRecord r = mock(RoomsRecord.class);
        when(r.getId()).thenReturn(id);
        when(r.getRoomNumber()).thenReturn(number);
        when(r.getFloor()).thenReturn(1);
        when(r.getRoomType()).thenReturn("STANDARD");
        when(r.getQualityLevel()).thenReturn("ECONOMY");
        when(r.getBedType()).thenReturn("QUEEN");
        when(r.getNumBeds()).thenReturn(1);
        when(r.getSmoking()).thenReturn(0);
        when(r.getDailyRate()).thenReturn(100.0f);
        when(r.getDescription()).thenReturn("desc");
        when(r.getStatus()).thenReturn("AVAILABLE");
        return r;
    }

    @Test
    void getAllRooms_returnsMappedDtos() {
        RoomsRecord r1 = mockRoom(1, "101");
        RoomsRecord r2 = mockRoom(2, "102");
        when(roomRepository.findAll()).thenReturn(List.of(r1, r2));

        List<RoomDto> result = roomService.getAllRooms();

        assertEquals(2, result.size());
        assertEquals("101", result.get(0).roomNumber());
    }

    @Test
    void getRoom_existingId_returnsDto() {
        RoomsRecord r = mockRoom(1, "101");
        when(roomRepository.findById(1)).thenReturn(r);

        RoomDto dto = roomService.getRoom(1);

        assertEquals("101", dto.roomNumber());
    }

    @Test
    void getRoom_missingId_throwsIllegalArgument() {
        when(roomRepository.findById(99)).thenReturn(null);

        assertThrows(IllegalArgumentException.class, () -> roomService.getRoom(99));
    }

    @Test
    void getAvailableRooms_returnsMappedDtos() {
        RoomsRecord r = mockRoom(1, "101");
        when(roomRepository.findAvailableBetween(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(r));

        List<RoomDto> result = roomService.getAvailableRooms("2025-06-01", "2025-06-05");

        assertEquals(1, result.size());
    }

    @Test
    void createRoom_callsInsert_returnsDto() {
        RoomDto input = new RoomDto(0, "201", 2, "STANDARD", "ECONOMY", "KING", 1, false, 120.0, "desc", "AVAILABLE");
        RoomsRecord inserted = mockRoom(5, "201");
        when(roomRepository.insert(input)).thenReturn(inserted);

        RoomDto result = roomService.createRoom(input);

        assertEquals("201", result.roomNumber());
        verify(roomRepository).insert(input);
    }

    @Test
    void updateRoom_callsUpdate_returnsDto() {
        RoomDto input = new RoomDto(1, "101", 1, "STANDARD", "ECONOMY", "QUEEN", 1, false, 100.0, "desc", "AVAILABLE");
        RoomsRecord r = mockRoom(1, "101");
        when(roomRepository.findById(1)).thenReturn(r);

        RoomDto result = roomService.updateRoom(1, input);

        verify(roomRepository).update(1, input);
        assertEquals("101", result.roomNumber());
    }
}
