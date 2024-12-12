package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.Review;
import edu.sabanciuniv.cs308.repo.CategoryRepo;
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

    public List<Product> getCategoryById(UUID categoryId) {
        Category category = repo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return category.getProducts();
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
        return repo.findAll();
    }

    public List<Product> getSortedProductsInCategory(UUID categoryId, String sortBy) {
        // Kategorideki ürünleri veri tabanından al
        List<Product> products = repo.findProductsByCategoryId(categoryId);

        // Eğer ürün listesi boşsa veya kategoriye ait ürün yoksa, boş listeyi geri döndür
        if (products == null || products.isEmpty()) {
            return products; // Geri dönen liste null değil, boş olmalıdır.
        }

        // Sıralama kriterine göre ürünleri sırala
        if ("priceLowToHigh".equalsIgnoreCase(sortBy)) {
            // Fiyat artan sırada
            products.sort(Comparator.comparing(Product::getPrice));
        } else if ("priceHighToLow".equalsIgnoreCase(sortBy)) {
            // Fiyat azalan sırada
            products.sort(Comparator.comparing(Product::getPrice).reversed());
        } // Sort by popularity (calculated score)
        else if ("popularity".equalsIgnoreCase(sortBy)) {
            // Sort by popularity score (higher score comes first)
            products.sort((p1, p2) -> Double.compare(calculatePopularityScore(p2), calculatePopularityScore(p1)));
        }

        // Eğer hiçbir kriter eşleşmezse sıralama yapılmaz, ürünler mevcut sıralama ile döner.
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

}