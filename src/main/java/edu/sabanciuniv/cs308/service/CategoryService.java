package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.Review;
import edu.sabanciuniv.cs308.repo.CategoryRepo;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepo repo;
    @Autowired
    private ProductRepo Prepo;

    public List<Product> getCategoryById(UUID categoryId) {
        Category category = repo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        // Only return products that are not deleted
        return category.getProducts().stream()
                .filter(product -> !product.getIsDeleted())
                .collect(Collectors.toList());
    }

    public Category addCategory(Category category) {
        return repo.save(category);
    }

    public Category updateCategory(UUID id, Category categoryDetails) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        return repo.save(category);
    }

    public void deleteCategory(UUID id) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        repo.delete(category);
    }

    public List<Category> getAllCategories() {
        return repo.findAll().stream()
                .filter(category -> Boolean.FALSE.equals(category.getIsDeleted())) // Filter out deleted categories
                .collect(Collectors.toList());
    }

    public List<Product> getSortedProductsInCategory(UUID categoryId, String sortBy) {
        // Fetch non-deleted products for the given category
        List<Product> products = Prepo.findByCategoryId(categoryId).stream()
                .filter(product -> !product.getIsDeleted()) // Only non-deleted products
                .collect(Collectors.toList());

        // If the list is empty, return an empty list
        if (products.isEmpty()) {
            return products;
        }

        // Sort the products based on the given criteria
        if ("priceLowToHigh".equalsIgnoreCase(sortBy)) {
            products.sort(Comparator.comparing(Product::getPrice));
        } else if ("priceHighToLow".equalsIgnoreCase(sortBy)) {
            products.sort(Comparator.comparing(Product::getPrice).reversed());
        } else if ("popularity".equalsIgnoreCase(sortBy)) {
            products.sort((p1, p2) -> Double.compare(calculatePopularityScore(p2), calculatePopularityScore(p1)));
        }

        return products;
    }

    private double calculatePopularityScore(Product product) {
        List<Review> reviews = product.getReviews(); // Get reviews for the product

        if (reviews == null || reviews.isEmpty()) {
            return 0; // No reviews, popularity score is 0
        }

        int ratingCount = reviews.size(); // Number of reviews
        double averageRating = reviews.stream()
                .filter(review -> review.getRating() != null) // Ignore null ratings
                .mapToInt(Review::getRating) // Get rating values
                .average()
                .orElse(0); // Calculate average or return 0 if empty

        return averageRating * ratingCount; // Popularity score formula
    }

    @Transactional
    public void markCategoryAndProductsAsDeleted(UUID categoryId) {
        // Fetch the category
        Category category = repo.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with ID: " + categoryId));

        // Mark all products in the category as deleted
        List<Product> products = Prepo.findByCategoryId(categoryId);
        products.forEach(product -> product.setIsDeleted(true));
        Prepo.saveAll(products);

        // Mark the category as deleted (optional if categories have a soft delete flag)
        category.setIsDeleted(true);
        repo.save(category);
    }

    // Method to get all categories excluding deleted ones
    public List<Category> getAllNonDeletedCategories() {
        return repo.findAll().stream()
                .filter(category -> !category.getIsDeleted())
                .collect(Collectors.toList());
    }
}
