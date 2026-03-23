package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.ProductsRecord;
import edu.baylor.cs.dto.CartItemRequest;
import edu.baylor.cs.dto.ProductDto;
import edu.baylor.cs.repository.OrderRepository;
import edu.baylor.cs.repository.ProductRepository;
import edu.baylor.cs.repository.ReservationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class StoreServiceTest {

    @Mock
    ReservationRepository reservationRepository;

    @Mock
    ProductRepository productRepository;

    @Mock
    OrderRepository orderRepository;

    @InjectMocks
    StoreService storeService;

    private ProductsRecord mockProduct(int id, String name, float price, int stock) {
        ProductsRecord p = mock(ProductsRecord.class);
        when(p.getId()).thenReturn(id);
        when(p.getName()).thenReturn(name);
        when(p.getCategory()).thenReturn("SNACK");
        when(p.getPrice()).thenReturn(price);
        when(p.getStockQuantity()).thenReturn(stock);
        when(p.getDescription()).thenReturn("desc");
        return p;
    }

    @Test
    void getAllProducts_returnsMappedDtos() {
        ProductsRecord chips = mockProduct(1, "Chips", 2.5f, 10);
        ProductsRecord water = mockProduct(2, "Water", 1.0f, 20);
        when(productRepository.findAll()).thenReturn(List.of(chips, water));

        List<ProductDto> result = storeService.getAllProducts();

        assertEquals(2, result.size());
        assertEquals("Chips", result.get(0).name());
    }

    @Test
    void addToCart_checkedInGuestWithStock_returnsOrderInfo() {
        when(reservationRepository.hasCheckedInReservationForUser(1)).thenReturn(true);
        when(productRepository.findStockById(5)).thenReturn(10);
        when(orderRepository.findCartIdByUserId(1)).thenReturn(42);
        when(productRepository.findPriceById(5)).thenReturn(3.0f);

        Map<String, Object> result = storeService.addToCart(1, new CartItemRequest(5, 2));

        assertEquals(42, result.get("orderId"));
        verify(orderRepository).insertOrderItem(42, 5, 2, 3.0f);
    }

    @Test
    void addToCart_notCheckedIn_throwsIllegalArgument() {
        when(reservationRepository.hasCheckedInReservationForUser(1)).thenReturn(false);

        assertThrows(IllegalArgumentException.class,
                () -> storeService.addToCart(1, new CartItemRequest(5, 1)));
    }

    @Test
    void addToCart_insufficientStock_throwsIllegalArgument() {
        when(reservationRepository.hasCheckedInReservationForUser(1)).thenReturn(true);
        when(productRepository.findStockById(5)).thenReturn(1);

        assertThrows(IllegalArgumentException.class,
                () -> storeService.addToCart(1, new CartItemRequest(5, 5)));
    }

    @Test
    void checkout_activeCart_createsBillAndDecrementsStock() {
        when(orderRepository.findCartIdByUserId(1)).thenReturn(42);
        when(orderRepository.calculateCartTotal(42)).thenReturn(15.0);
        when(orderRepository.getItemsForOrder(42)).thenReturn(List.of(new int[]{5, 2}, new int[]{6, 1}));
        when(orderRepository.insertBill(1, 42, 15.0f)).thenReturn(7);

        Map<String, Object> result = storeService.checkout(1);

        assertEquals(42, result.get("orderId"));
        assertEquals(7, result.get("billId"));
        verify(productRepository).decrementStock(5, 2);
        verify(productRepository).decrementStock(6, 1);
        verify(orderRepository).markPurchased(eq(42), any());
    }

    @Test
    void checkout_noActiveCart_throwsIllegalArgument() {
        when(orderRepository.findCartIdByUserId(1)).thenReturn(null);

        assertThrows(IllegalArgumentException.class, () -> storeService.checkout(1));
    }
}
