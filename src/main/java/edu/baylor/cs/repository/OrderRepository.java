package edu.baylor.cs.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface OrderRepository {
    Integer findCartIdByUserId(int userId);
    int insertCart(int userId);
    void insertOrderItem(int orderId, int productId, int quantity, Float price);
    List<Map<String, Object>> findCartItemsByUserId(int userId);
    Double calculateCartTotal(int orderId);
    void markPurchased(int orderId, LocalDateTime purchasedAt);
    int insertBill(int userId, int orderId, float total);
    List<int[]> getItemsForOrder(int orderId);
}
