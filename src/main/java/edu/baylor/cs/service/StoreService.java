package edu.baylor.cs.service;

import edu.baylor.cs.dto.CartItemRequest;
import edu.baylor.cs.dto.ProductDto;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static edu.baylor.cs.db.Tables.*;

/**
 * Manages the hotel store: products, shopping cart, and order checkout.
 */
@Service
public class StoreService {

    private final DSLContext db;

    public StoreService(DSLContext db) {
        this.db = db;
    }

    /** Returns all available products. */
    public List<ProductDto> getAllProducts() {
        return db.selectFrom(PRODUCTS).fetch(r -> new ProductDto(
                r.getId(), r.getName(), r.getCategory(),
                r.getPrice(), r.getStockQuantity(), r.getDescription()));
    }

    /**
     * Adds an item to the user's active cart, creating the cart if needed.
     * @throws IllegalArgumentException if the user has no active reservation or product is out of stock
     */
    public Map<String, Object> addToCart(int userId, CartItemRequest req) {
        // Verify guest has an active stay (CHECKED_IN)
        boolean hasActiveStay = db.fetchExists(
                db.selectFrom(RESERVATIONS)
                        .where(RESERVATIONS.USER_ID.eq(userId))
                        .and(RESERVATIONS.STATUS.eq("CHECKED_IN")));
        if (!hasActiveStay) {
            throw new IllegalArgumentException("Only checked-in guests can shop in the store");
        }

        // Check stock
        Integer stock = db.select(PRODUCTS.STOCK_QUANTITY)
                .from(PRODUCTS).where(PRODUCTS.ID.eq(req.productId()))
                .fetchOneInto(Integer.class);
        if (stock == null || stock < req.quantity()) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        // Get or create CART order
        Integer orderId = db.select(ORDERS.ID).from(ORDERS)
                .where(ORDERS.USER_ID.eq(userId)).and(ORDERS.STATUS.eq("CART"))
                .fetchOneInto(Integer.class);
        if (orderId == null) {
            orderId = db.insertInto(ORDERS)
                    .set(ORDERS.USER_ID, userId)
                    .set(ORDERS.STATUS, "CART")
                    .returning(ORDERS.ID)
                    .fetchOne()
                    .getId();
        }

        Float price = db.select(PRODUCTS.PRICE).from(PRODUCTS)
                .where(PRODUCTS.ID.eq(req.productId())).fetchOneInto(Float.class);

        db.insertInto(ORDER_ITEMS)
                .set(ORDER_ITEMS.ORDER_ID, orderId)
                .set(ORDER_ITEMS.PRODUCT_ID, req.productId())
                .set(ORDER_ITEMS.QUANTITY, req.quantity())
                .set(ORDER_ITEMS.PRICE_AT_PURCHASE, price)
                .execute();

        return Map.of("orderId", orderId, "message", "Item added to cart");
    }

    /** Returns the current cart contents for a user. */
    public List<Map<String, Object>> getCart(int userId) {
        return db.select(
                        ORDER_ITEMS.ID, PRODUCTS.NAME, PRODUCTS.CATEGORY,
                        ORDER_ITEMS.QUANTITY, ORDER_ITEMS.PRICE_AT_PURCHASE)
                .from(ORDER_ITEMS)
                .join(ORDERS).on(ORDERS.ID.eq(ORDER_ITEMS.ORDER_ID))
                .join(PRODUCTS).on(PRODUCTS.ID.eq(ORDER_ITEMS.PRODUCT_ID))
                .where(ORDERS.USER_ID.eq(userId))
                .and(ORDERS.STATUS.eq("CART"))
                .fetch(r -> Map.of(
                        "itemId", r.get(ORDER_ITEMS.ID),
                        "name", r.get(PRODUCTS.NAME),
                        "category", r.get(PRODUCTS.CATEGORY),
                        "quantity", r.get(ORDER_ITEMS.QUANTITY),
                        "price", r.get(ORDER_ITEMS.PRICE_AT_PURCHASE).doubleValue()
                ));
    }

    /**
     * Purchases all items in the user's cart.
     * Decrements stock and creates a bill entry.
     */
    public Map<String, Object> checkout(int userId) {
        Integer orderId = db.select(ORDERS.ID).from(ORDERS)
                .where(ORDERS.USER_ID.eq(userId)).and(ORDERS.STATUS.eq("CART"))
                .fetchOneInto(Integer.class);
        if (orderId == null) throw new IllegalArgumentException("No active cart");

        // Calculate total
        Double total = db.select(
                        org.jooq.impl.DSL.sum(ORDER_ITEMS.PRICE_AT_PURCHASE.multiply(ORDER_ITEMS.QUANTITY)))
                .from(ORDER_ITEMS)
                .where(ORDER_ITEMS.ORDER_ID.eq(orderId))
                .fetchOneInto(Double.class);

        // Mark order as purchased
        db.update(ORDERS)
                .set(ORDERS.STATUS, "PURCHASED")
                .set(ORDERS.PURCHASED_AT, LocalDateTime.now())
                .where(ORDERS.ID.eq(orderId))
                .execute();

        // Decrement stock
        db.select(ORDER_ITEMS.PRODUCT_ID, ORDER_ITEMS.QUANTITY)
                .from(ORDER_ITEMS)
                .where(ORDER_ITEMS.ORDER_ID.eq(orderId))
                .forEach(r -> db.update(PRODUCTS)
                        .set(PRODUCTS.STOCK_QUANTITY,
                                PRODUCTS.STOCK_QUANTITY.minus(r.get(ORDER_ITEMS.QUANTITY)))
                        .where(PRODUCTS.ID.eq(r.get(ORDER_ITEMS.PRODUCT_ID)))
                        .execute());

        float totalFloat = total != null ? total.floatValue() : 0.0f;

        // Create bill
        int billId = db.insertInto(BILLS)
                .set(BILLS.USER_ID, userId)
                .set(BILLS.ORDER_ID, orderId)
                .set(BILLS.TOTAL_AMOUNT, totalFloat)
                .set(BILLS.PAID, 0)
                .returning(BILLS.ID)
                .fetchOne()
                .getId();

        return Map.of("orderId", orderId, "billId", billId, "total", total != null ? total : 0.0);
    }
}
