package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.dto.ProductDto;
import edu.baylor.cs.service.IAuthService;
import edu.baylor.cs.service.IStoreService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StoreController.class)
class StoreControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    IStoreService storeService;

    @MockBean
    IAuthService authService;

    @Test
    void getProducts_returns200() throws Exception {
        when(storeService.getAllProducts()).thenReturn(
                List.of(new ProductDto(1, "Chips", "SNACK", 2.5, 10, "desc")));

        mockMvc.perform(get("/api/store/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Chips"));
    }

    @Test
    void getCart_authenticated_returns200() throws Exception {
        UsersRecord guest = mock(UsersRecord.class);
        when(guest.getId()).thenReturn(1);
        when(authService.getUserFromToken(any())).thenReturn(guest);
        when(storeService.getCart(1)).thenReturn(List.of(
                Map.of("itemId", 1, "name", "Chips", "quantity", 2, "price", 2.5, "category", "SNACK")));

        mockMvc.perform(get("/api/store/cart")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Chips"));
    }

    @Test
    void addToCart_authenticated_returns200() throws Exception {
        UsersRecord guest = mock(UsersRecord.class);
        when(guest.getId()).thenReturn(1);
        when(authService.getUserFromToken(any())).thenReturn(guest);
        when(storeService.addToCart(eq(1), any())).thenReturn(Map.of("orderId", 42, "message", "Item added to cart"));

        mockMvc.perform(post("/api/store/cart")
                        .header("Authorization", "Bearer token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"productId\":1,\"quantity\":2}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(42));
    }

    @Test
    void checkout_authenticated_returns200() throws Exception {
        UsersRecord guest = mock(UsersRecord.class);
        when(guest.getId()).thenReturn(1);
        when(authService.getUserFromToken(any())).thenReturn(guest);
        when(storeService.checkout(1)).thenReturn(Map.of("orderId", 42, "billId", 7, "total", 15.0));

        mockMvc.perform(post("/api/store/checkout")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.billId").value(7));
    }
}
