package edu.baylor.cs.service;

import edu.baylor.cs.db.tables.records.ProductsRecord;
import edu.baylor.cs.dto.CartItemRequest;
import edu.baylor.cs.dto.ProductDto;
import edu.baylor.cs.repository.OrderRepository;
import edu.baylor.cs.repository.ProductRepository;
import edu.baylor.cs.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Manages the hotel store: products, shopping cart, and order checkout.
 */
@Service
public class StoreService implements IStoreService {

    private final ReservationRepository reservationRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public StoreService(ReservationRepository reservationRepository,
                        ProductRepository productRepository,
                        OrderRepository orderRepository) {
        this.reservationRepository = reservationRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    /** Returns all available products. */
    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(r -> new ProductDto(r.getId(), r.getName(), r.getCategory(),
                        r.getPrice(), r.getStockQuantity(), r.getDescription()))
                .toList();
    }

    /**
     * Adds an item to the user's active cart, creating the cart if needed.
     * @throws IllegalArgumentException if the user has no active reservation or product is out of stock
     */
    @Override
    public Map<String, Object> addToCart(int userId, CartItemRequest req) {
        if (!reservationRepository.hasCheckedInReservationForUser(userId)) {
            throw new IllegalArgumentException("Only checked-in guests can shop in the store");
        }

        Integer stock = productRepository.findStockById(req.productId());
        if (stock == null || stock < req.quantity()) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        Integer orderId = orderRepository.findCartIdByUserId(userId);
        if (orderId == null) {
            orderId = orderRepository.insertCart(userId);
        }

        Float price = productRepository.findPriceById(req.productId());
        orderRepository.insertOrderItem(orderId, req.productId(), req.quantity(), price);

        return Map.of("orderId", orderId, "message", "Item added to cart");
    }

    /** Returns the current cart contents for a user. */
    @Override
    public List<Map<String, Object>> getCart(int userId) {
        return orderRepository.findCartItemsByUserId(userId);
    }

    /**
     * Purchases all items in the user's cart.
     * Decrements stock and creates a bill entry.
     */
    @Override
    public Map<String, Object> checkout(int userId) {
        Integer orderId = orderRepository.findCartIdByUserId(userId);
        if (orderId == null) throw new IllegalArgumentException("No active cart");

        Double total = orderRepository.calculateCartTotal(orderId);
        orderRepository.markPurchased(orderId, LocalDateTime.now());

        for (int[] item : orderRepository.getItemsForOrder(orderId)) {
            productRepository.decrementStock(item[0], item[1]);
        }

        float totalFloat = total != null ? total.floatValue() : 0.0f;
        int billId = orderRepository.insertBill(userId, orderId, totalFloat);

        return Map.of("orderId", orderId, "billId", billId, "total", total != null ? total : 0.0);
    }
}
