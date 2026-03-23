package edu.baylor.cs.repository;

import edu.baylor.cs.db.tables.records.ProductsRecord;

import java.util.List;

public interface ProductRepository {
    List<ProductsRecord> findAll();
    Integer findStockById(int id);
    Float findPriceById(int id);
    void decrementStock(int productId, int quantity);
}
