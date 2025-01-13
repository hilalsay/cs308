package edu.sabanciuniv.cs308.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.Review;
import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.model.Wishlist;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    @Autowired
    private ProductRepo repo;

    @Autowired
    private edu.sabanciuniv.cs308.repo.WishlistRepo wishlistRepo;

    @Autowired
    private EmailSender emailService;

    @Autowired
    private UserService userService;

    public List<Product> getProducts() {
        return repo.findByIsDeletedFalse();
    }

    // Method to get only products in stock
    public List<Product> getProductsInStock() {
        return repo.findByStockQuantityGreaterThan(0);
    }

    public Product getProductById(UUID productId) {
        return repo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product addProduct(Product product, MultipartFile image)throws IOException{
        if (image != null && !image.isEmpty()) {
            product.setImageName(image.getOriginalFilename());
            product.setImageType(image.getContentType());
            product.setImageData(image.getBytes());
        }
        return repo.save(product);
    }

    public Product updateProductPrice(UUID productId, BigDecimal newPrice) {
        // Fetch the existing product
        Product existingProduct = repo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update the price if a valid new price is provided
        if (newPrice != null && newPrice.compareTo(BigDecimal.ZERO) >= 0) {
            existingProduct.setPrice(newPrice);
        } else {
            throw new IllegalArgumentException("Invalid price value");
        }

        // Save and return the updated product
        return repo.save(existingProduct);
    }

    public Product updateProductDiscount(UUID productId, Double discountRate) {
        // Find the product by its ID
        Product product = repo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Validate discount rate (must be between 0 and 100)
        if (discountRate == null || discountRate < 0 || discountRate > 100) {
            throw new IllegalArgumentException("Discount rate must be between 0 and 100");
        }

        // Set the discount rate
        product.setDiscountRate(discountRate);

        // Calculate and set the discounted price
        BigDecimal discountMultiplier = BigDecimal.valueOf(1 - (discountRate / 100));
        BigDecimal discountedPrice = product.getPrice().multiply(discountMultiplier);
        product.setDiscountedPrice(discountedPrice);


        // Notify users with the product in their wishlist
        notifyUsersWithWishlistProduct(product);

        // Save the updated product and return it
        return repo.save(product);
    }

    public Product removeProductDiscount(UUID productId) {
        // Find the product by its ID
        Product product = repo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if the product has an old price
        if (product.getDiscountedPrice() == null) {
            throw new IllegalStateException("Product does not have a discount to remove");
        }

        // Clear the old price and discount rate
        product.setDiscountedPrice(null);
        product.setDiscountRate(null);

        // Save the updated product and return it
        return repo.save(product);
    }

    private void notifyUsersWithWishlistProduct(Product product) {
        // Find all wishlists containing the product
        List<Wishlist> wishlists = wishlistRepo.findAllByProductsContains(product);

        for (Wishlist wishlist : wishlists) {
            // Get user information
            User user = wishlist.getUser();
            String email = user.getEmail(); // Assuming User has an email field

            // Prepare and send email
            if (product.getDiscountedPrice().compareTo(product.getPrice()) != 0) {
                // Prepare and send email
                String subject = "Discount Alert: " + product.getName();
                String body = "Good news! A product in your wishlist, " + product.getName() +
                        ", is now available at a discounted price of " + product.getDiscountedPrice() +
                        ". Original price was " + product.getPrice() + ". Check it out now!";
                emailService.sendSimpleEmail(email, subject, body);
            }
        }
    }

    public Product updateProduct(UUID productId, String productJson, MultipartFile image) throws IOException {
        // Deserialize the incoming product JSON
        ObjectMapper objectMapper = new ObjectMapper();
        Product updatedProduct = objectMapper.readValue(productJson, Product.class);

        // Fetch the existing product
        Product existingProduct = repo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update fields only if provided in the request
        if (updatedProduct.getName() != null) {
            existingProduct.setName(updatedProduct.getName());
        }
        if (updatedProduct.getModel() != null) {
            existingProduct.setModel(updatedProduct.getModel());
        }
        if (updatedProduct.getSerialNumber() != null) {
            existingProduct.setSerialNumber(updatedProduct.getSerialNumber());
        }
        if (updatedProduct.getDescription() != null) {
            existingProduct.setDescription(updatedProduct.getDescription());
        }
        if (updatedProduct.getStockQuantity() != null) {
            existingProduct.setStockQuantity(updatedProduct.getStockQuantity());
        }
        if (updatedProduct.getPrice() != null) {
            existingProduct.setPrice(updatedProduct.getPrice());
        }
        if (updatedProduct.getWarrantyStatus() != null) {
            existingProduct.setWarrantyStatus(updatedProduct.getWarrantyStatus());
        }
        if (updatedProduct.getDistributorInformation() != null) {
            existingProduct.setDistributorInformation(updatedProduct.getDistributorInformation());
        }
        if (updatedProduct.getCategory() != null) {
            existingProduct.setCategory(updatedProduct.getCategory());
        }

        // Handle image update if provided
        if (image != null && !image.isEmpty()) {
            existingProduct.setImageName(image.getOriginalFilename());
            existingProduct.setImageType(image.getContentType());
            existingProduct.setImageData(image.getBytes());
        }

        // Save and return the updated product
        return repo.save(existingProduct);
    }

    public void deleteProduct(UUID productId) {
        repo.deleteById(productId);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
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

        double popularity = averageRating * ratingCount; // Popularity score formula
        product.setPopularity(popularity); // Set popularity field
        return popularity;
    }


    // Method to get products sorted based on the given sort criteria
    public List<Product> getSortedProducts(String sortBy) {
        List<Product> products = repo.findActiveProducts(); // Get all products from the repository

        // Sort by price in ascending order
        if ("priceLowToHigh".equalsIgnoreCase(sortBy)) {
            products.sort(Comparator.comparing(Product::getPrice)); // Sort by price (low to high)
        }
        // Sort by price in descending order
        else if ("priceHighToLow".equalsIgnoreCase(sortBy)) {
            products.sort(Comparator.comparing(Product::getPrice).reversed()); // Sort by price (high to low)
        }

        // Sort by popularity (calculated score)
        else if ("popularity".equalsIgnoreCase(sortBy)) {
            // Sort by popularity (calculated score)
            products.sort(Comparator.comparing(Product::getPopularity).reversed()); // Sort by popularity score (higher score comes first)
        }
        return products; // Return the sorted list of products
    }

    @Transactional
    public void markProductAsDeleted(UUID productId) {
        Product product = repo.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + productId));

        product.setIsDeleted(true); // Mark as deleted
        repo.save(product);
    }

    public List<Product> getActiveProducts() {
        return repo.findByIsDeletedFalse(); // Get only active products (not marked as deleted)
    }
}
