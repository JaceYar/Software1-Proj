package edu.baylor.cs.service;

import edu.baylor.cs.dto.CartItemRequest;
import edu.baylor.cs.dto.CheckoutRequest;
import edu.baylor.cs.dto.ProductDto;
import edu.baylor.cs.repository.OrderRepository;
import edu.baylor.cs.repository.ProductRepository;
import edu.baylor.cs.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Manages the hotel store: products, shopping cart, and order checkout.
 */
@Service
public class StoreService implements IStoreService {
    private static final String PAY_NOW = "PAY_NOW";
    private static final String CHARGE_ROOM = "CHARGE_ROOM";

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
    @Transactional
    public Map<String, Object> addToCart(int userId, CartItemRequest req) {
        if (!reservationRepository.hasCheckedInReservationForUser(userId)) {
            throw new IllegalArgumentException("Only checked-in guests can shop in the store");
        }
        if (req.quantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        Integer stock = productRepository.findStockById(req.productId());
        if (stock == null) {
            throw new IllegalArgumentException("Product not found");
        }

        boolean reserved = productRepository.decrementStock(req.productId(), req.quantity());
        if (!reserved) {
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

    @Override
    @Transactional
    public Map<String, Object> removeFromCart(int userId, int itemId) {
        Integer orderId = orderRepository.findCartIdByUserId(userId);
        if (orderId == null) {
            throw new IllegalArgumentException("No active cart");
        }

        Map<String, Integer> item = orderRepository.findCartItemById(orderId, itemId);
        if (item == null) {
            throw new IllegalArgumentException("Cart item not found");
        }

        int productId = item.get("productId");
        int quantity = item.get("quantity");
        productRepository.incrementStock(productId, quantity);
        orderRepository.deleteCartItem(orderId, itemId);

        return Map.of("orderId", orderId, "message", "Item removed from cart");
    }

    /**
     * Purchases all items in the user's cart.
     * Decrements stock and creates a bill entry.
     */
    @Override
    @Transactional
    public Map<String, Object> checkout(int userId, CheckoutRequest req) {
        Integer orderId = orderRepository.findCartIdByUserId(userId);
        if (orderId == null) throw new IllegalArgumentException("No active cart");

        String paymentMethod = normalizePaymentMethod(req);
        Integer reservationId = reservationRepository.findCheckedInReservationIdByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No active checked-in stay found for checkout"));

        Double total = orderRepository.calculateCartTotal(orderId);
        orderRepository.markPurchased(orderId, LocalDateTime.now());

        float totalFloat = total != null ? total.floatValue() : 0.0f;
        boolean paidNow = PAY_NOW.equals(paymentMethod);
        LocalDateTime paidAt = paidNow ? LocalDateTime.now() : null;
        int billId = orderRepository.insertBill(
                userId,
                reservationId,
                orderId,
                totalFloat,
                paymentMethod,
                paidNow ? 1 : 0,
                paidAt
        );

        return Map.of(
                "orderId", orderId,
                "billId", billId,
                "total", total != null ? total : 0.0,
                "paymentMethod", paymentMethod,
                "paid", paidNow
        );
    }

    private String normalizePaymentMethod(CheckoutRequest req) {
        String raw = req == null || req.paymentMethod() == null ? PAY_NOW : req.paymentMethod().trim().toUpperCase();
        if (!PAY_NOW.equals(raw) && !CHARGE_ROOM.equals(raw)) {
            throw new IllegalArgumentException("Invalid payment method. Use PAY_NOW or CHARGE_ROOM");
        }
        return raw;
    }
}
