package edu.baylor.cs.service;

import edu.baylor.cs.dto.CartItemRequest;
import edu.baylor.cs.dto.ProductDto;

import java.util.List;
import java.util.Map;

public interface IStoreService {
    List<ProductDto> getAllProducts();
    List<Map<String, Object>> getCart(int userId);
    Map<String, Object> addToCart(int userId, CartItemRequest req);
    Map<String, Object> checkout(int userId);
}
