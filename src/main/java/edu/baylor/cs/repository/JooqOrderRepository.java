package edu.baylor.cs.repository;

import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static edu.baylor.cs.db.Tables.*;

@Repository
public class JooqOrderRepository implements OrderRepository {

    private final DSLContext db;

    public JooqOrderRepository(DSLContext db) {
        this.db = db;
    }

    @Override
    public Integer findCartIdByUserId(int userId) {
        return db.select(ORDERS.ID).from(ORDERS)
                .where(ORDERS.USER_ID.eq(userId)).and(ORDERS.STATUS.eq("CART"))
                .fetchOneInto(Integer.class);
    }

    @Override
    public int insertCart(int userId) {
        return db.insertInto(ORDERS)
                .set(ORDERS.USER_ID, userId)
                .set(ORDERS.STATUS, "CART")
                .returning(ORDERS.ID)
                .fetchOne()
                .getId();
    }

    @Override
    public void insertOrderItem(int orderId, int productId, int quantity, Float price) {
        db.insertInto(ORDER_ITEMS)
                .set(ORDER_ITEMS.ORDER_ID, orderId)
                .set(ORDER_ITEMS.PRODUCT_ID, productId)
                .set(ORDER_ITEMS.QUANTITY, quantity)
                .set(ORDER_ITEMS.PRICE_AT_PURCHASE, price)
                .execute();
    }

    @Override
    public List<Map<String, Object>> findCartItemsByUserId(int userId) {
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

    @Override
    public Double calculateCartTotal(int orderId) {
        return db.select(
                        DSL.sum(ORDER_ITEMS.PRICE_AT_PURCHASE.multiply(ORDER_ITEMS.QUANTITY)))
                .from(ORDER_ITEMS)
                .where(ORDER_ITEMS.ORDER_ID.eq(orderId))
                .fetchOneInto(Double.class);
    }

    @Override
    public void markPurchased(int orderId, LocalDateTime purchasedAt) {
        db.update(ORDERS)
                .set(ORDERS.STATUS, "PURCHASED")
                .set(ORDERS.PURCHASED_AT, purchasedAt)
                .where(ORDERS.ID.eq(orderId))
                .execute();
    }

    @Override
    public int insertBill(int userId, int orderId, float total) {
        return db.insertInto(BILLS)
                .set(BILLS.USER_ID, userId)
                .set(BILLS.ORDER_ID, orderId)
                .set(BILLS.TOTAL_AMOUNT, total)
                .set(BILLS.PAID, 0)
                .returning(BILLS.ID)
                .fetchOne()
                .getId();
    }

    @Override
    public List<int[]> getItemsForOrder(int orderId) {
        return db.select(ORDER_ITEMS.PRODUCT_ID, ORDER_ITEMS.QUANTITY)
                .from(ORDER_ITEMS)
                .where(ORDER_ITEMS.ORDER_ID.eq(orderId))
                .fetch(r -> new int[]{r.get(ORDER_ITEMS.PRODUCT_ID), r.get(ORDER_ITEMS.QUANTITY)});
    }
}
