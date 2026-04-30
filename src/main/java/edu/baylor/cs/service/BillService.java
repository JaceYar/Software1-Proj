package edu.baylor.cs.service;

import edu.baylor.cs.dto.BillLineItemDto;
import edu.baylor.cs.dto.MyLastStayBillDto;
import edu.baylor.cs.dto.StaySummaryDto;
import edu.baylor.cs.dto.StorePurchaseDto;
import edu.baylor.cs.repository.ReservationRepository;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalDateTime;

import static edu.baylor.cs.db.Tables.BILLS;
import static edu.baylor.cs.db.Tables.ORDER_ITEMS;
import static edu.baylor.cs.db.Tables.PRODUCTS;

@Service
public class BillService implements IBillService {

    private final ReservationRepository reservationRepository;
    private final DSLContext db;

    public BillService(ReservationRepository reservationRepository, DSLContext db) {
        this.reservationRepository = reservationRepository;
        this.db = db;
    }

    @Override
    public MyLastStayBillDto getMyLastStayBill(int userId) {
        Record reservationRecord = reservationRepository.findMostRecentReservationForUserWithRoom(userId);
        if (reservationRecord == null) {
            return null;
        }

        int reservationId = reservationRecord.get("id", Integer.class);
        double roomCharge = reservationRecord.get("rate", Float.class);
        StaySummaryDto stay = new StaySummaryDto(
                reservationId,
                reservationRecord.get("room_number", String.class),
                reservationRecord.get("check_in_date", Object.class).toString(),
                reservationRecord.get("check_out_date", Object.class).toString(),
                reservationRecord.get("status", String.class),
                roomCharge
        );

        List<StorePurchaseDto> purchases = db.select(
                        BILLS.ID,
                        BILLS.ORDER_ID,
                        BILLS.TOTAL_AMOUNT,
                        BILLS.PAYMENT_METHOD,
                        BILLS.PAID,
                        BILLS.CREATED_AT
                )
                .from(BILLS)
                .where(BILLS.USER_ID.eq(userId))
                .and(BILLS.RESERVATION_ID.eq(reservationId))
                .and(BILLS.ORDER_ID.isNotNull())
                .and(BILLS.PAYMENT_METHOD.eq("CHARGE_ROOM"))
                .orderBy(BILLS.CREATED_AT.desc(), BILLS.ID.desc())
                .fetch(billRecord -> {
                    int orderId = billRecord.get(BILLS.ORDER_ID);
                    List<BillLineItemDto> items = db.select(
                                    ORDER_ITEMS.PRODUCT_ID,
                                    PRODUCTS.NAME,
                                    PRODUCTS.CATEGORY,
                                    ORDER_ITEMS.QUANTITY,
                                    ORDER_ITEMS.PRICE_AT_PURCHASE
                            )
                            .from(ORDER_ITEMS)
                            .join(PRODUCTS).on(PRODUCTS.ID.eq(ORDER_ITEMS.PRODUCT_ID))
                            .where(ORDER_ITEMS.ORDER_ID.eq(orderId))
                            .fetch(itemRecord -> {
                                int quantity = itemRecord.get(ORDER_ITEMS.QUANTITY);
                                double unitPrice = itemRecord.get(ORDER_ITEMS.PRICE_AT_PURCHASE).doubleValue();
                                return new BillLineItemDto(
                                        itemRecord.get(ORDER_ITEMS.PRODUCT_ID),
                                        itemRecord.get(PRODUCTS.NAME),
                                        itemRecord.get(PRODUCTS.CATEGORY),
                                        quantity,
                                        unitPrice,
                                        unitPrice * quantity
                                );
                            });

                    return new StorePurchaseDto(
                            billRecord.get(BILLS.ID),
                            orderId,
                            billRecord.get(BILLS.TOTAL_AMOUNT).doubleValue(),
                            billRecord.get(BILLS.PAYMENT_METHOD),
                            billRecord.get(BILLS.PAID) != null && billRecord.get(BILLS.PAID) == 1,
                            billRecord.get(BILLS.CREATED_AT).toString(),
                            items
                    );
                });

        double storeTotal = purchases.stream().mapToDouble(StorePurchaseDto::totalAmount).sum();
        boolean roomPaid = db.fetchExists(
                db.selectOne()
                        .from(BILLS)
                        .where(BILLS.USER_ID.eq(userId))
                        .and(BILLS.RESERVATION_ID.eq(reservationId))
                        .and(BILLS.ORDER_ID.isNull())
                        .and(BILLS.PAID.eq(1))
        );

        int unpaidStoreCount = db.selectCount()
                .from(BILLS)
                .where(BILLS.USER_ID.eq(userId))
                .and(BILLS.RESERVATION_ID.eq(reservationId))
                .and(BILLS.ORDER_ID.isNotNull())
                .and(BILLS.PAYMENT_METHOD.eq("CHARGE_ROOM"))
                .and(BILLS.PAID.eq(0))
                .fetchOne(0, int.class);

        boolean fullyPaid = roomPaid && unpaidStoreCount == 0;

        return new MyLastStayBillDto(stay, purchases, roomCharge, storeTotal, roomCharge + storeTotal, fullyPaid);
    }

    @Override
    public void payEntireBill(int userId, int reservationId) {
        Record reservationRecord = reservationRepository.findMostRecentReservationForUserWithRoom(userId);
        if (reservationRecord == null || reservationRecord.get("id", Integer.class) != reservationId) {
            throw new IllegalArgumentException("Reservation not found");
        }

        LocalDateTime now = LocalDateTime.now();
        Double roomCharge = reservationRecord.get("rate", Float.class).doubleValue();

        Record roomBill = db.select(BILLS.ID, BILLS.PAID)
                .from(BILLS)
                .where(BILLS.USER_ID.eq(userId))
                .and(BILLS.RESERVATION_ID.eq(reservationId))
                .and(BILLS.ORDER_ID.isNull())
                .orderBy(BILLS.ID.desc())
                .limit(1)
                .fetchOne();

        if (roomBill == null) {
            db.insertInto(BILLS)
                    .set(BILLS.USER_ID, userId)
                    .set(BILLS.RESERVATION_ID, reservationId)
                    .set(BILLS.ORDER_ID, (Integer) null)
                    .set(BILLS.TOTAL_AMOUNT, roomCharge.floatValue())
                    .set(BILLS.PAYMENT_METHOD, "PAY_NOW")
                    .set(BILLS.PAID, 1)
                    .set(BILLS.PAID_AT, now)
                    .execute();
        } else if (roomBill.get(BILLS.PAID) == 0) {
            db.update(BILLS)
                    .set(BILLS.PAID, 1)
                    .set(BILLS.PAID_AT, now)
                    .where(BILLS.ID.eq(roomBill.get(BILLS.ID)))
                    .execute();
        }

        db.update(BILLS)
                .set(BILLS.PAID, 1)
                .set(BILLS.PAID_AT, now)
                .where(BILLS.USER_ID.eq(userId))
                .and(BILLS.RESERVATION_ID.eq(reservationId))
                .and(BILLS.PAID.eq(0))
                .execute();
    }
}
