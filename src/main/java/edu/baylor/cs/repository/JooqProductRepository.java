package edu.baylor.cs.repository;

import edu.baylor.cs.db.tables.records.ProductsRecord;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

import static edu.baylor.cs.db.Tables.PRODUCTS;

@Repository
public class JooqProductRepository implements ProductRepository {

    private final DSLContext db;

    public JooqProductRepository(DSLContext db) {
        this.db = db;
    }

    @Override
    public List<ProductsRecord> findAll() {
        return db.selectFrom(PRODUCTS).fetchInto(ProductsRecord.class);
    }

    @Override
    public Integer findStockById(int id) {
        return db.select(PRODUCTS.STOCK_QUANTITY).from(PRODUCTS)
                .where(PRODUCTS.ID.eq(id)).fetchOneInto(Integer.class);
    }

    @Override
    public Float findPriceById(int id) {
        return db.select(PRODUCTS.PRICE).from(PRODUCTS)
                .where(PRODUCTS.ID.eq(id)).fetchOneInto(Float.class);
    }

    @Override
    public void decrementStock(int productId, int quantity) {
        db.update(PRODUCTS)
                .set(PRODUCTS.STOCK_QUANTITY, PRODUCTS.STOCK_QUANTITY.minus(quantity))
                .where(PRODUCTS.ID.eq(productId))
                .execute();
    }
}
