package edu.baylor.cs.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface OrderRepository {
    Integer findCartIdByUserId(int userId);
    int insertCart(int userId);
    void insertOrderItem(int orderId, int productId, int quantity, Float price);
    List<Map<String, Object>> findCartItemsByUserId(int userId);
    Map<String, Integer> findCartItemById(int orderId, int itemId);
    void deleteCartItem(int orderId, int itemId);
    Double calculateCartTotal(int orderId);
    void markPurchased(int orderId, LocalDateTime purchasedAt);
    int insertBill(int userId, int reservationId, int orderId, float total, String paymentMethod, int paid, LocalDateTime paidAt);
    List<int[]> getItemsForOrder(int orderId);
}
