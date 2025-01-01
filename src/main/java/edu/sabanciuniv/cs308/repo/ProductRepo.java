package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepo extends JpaRepository<Product, UUID> {

    // Fetch product by ID (excluding deleted products)
    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.isDeleted = false")
    Optional<Product> findActiveProductById(@Param("id") UUID id);

    // Fetch all active (non-deleted) products
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false")
    List<Product> findActiveProducts();

    // Fetch in-stock products (excluding deleted products)
    @Query("SELECT p FROM Product p WHERE p.stockQuantity > 0 AND p.isDeleted = false")
    List<Product> findByStockQuantityGreaterThan(Integer stockQuantity);

    // Search products (excluding deleted products)
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND (" +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.model) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.serialNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.distributorInformation) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchProducts(@Param("keyword") String keyword);

    // Fetch all products by category (excluding deleted products)
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isDeleted = false")
    List<Product> findByCategoryId(@Param("categoryId") UUID categoryId);

    List<Product> findByIsDeletedFalse();
}
