package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    @Autowired
    private ProductRepo repo;

    public List<Product> getProducts() {
        return repo.findAll();
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


    public Product updateProduct(UUID productId, Product updatedProduct, MultipartFile image) throws IOException {
        Product existingProduct = repo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update fields
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setModel(updatedProduct.getModel());
        existingProduct.setSerialNumber(updatedProduct.getSerialNumber());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setStockQuantity(updatedProduct.getStockQuantity());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setWarrantyStatus(updatedProduct.getWarrantyStatus());
        existingProduct.setDistributorInformation(updatedProduct.getDistributorInformation());
        existingProduct.setCategory(updatedProduct.getCategory());

        if (image != null && !image.isEmpty()) {
            existingProduct.setImageName(image.getOriginalFilename());
            existingProduct.setImageType(image.getContentType());
            existingProduct.setImageData(image.getBytes());
        }

        return repo.save(existingProduct);
    }

    public void deleteProduct(UUID productId) {
        repo.deleteById(productId);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }

    /**
     * // Method to calculate the popularity score based on sales count and average rating
     *     public double calculatePopularityScore(Product product) {
     *         double weightSales = 0.7; // Weight for sales count (70%)
     *         double weightRating = 0.3; // Weight for average rating (30%)
     *
     *         // Calculate popularity score by combining sales and rating
     *         return (product.getSalesCount() * weightSales) + (product.getAverageRating() * weightRating);
     */

    // Method to get products sorted based on the given sort criteria
    public List<Product> getSortedProducts(String sortBy) {
        List<Product> products = repo.findAll(); // Get all products from the repository

        // Sort by price in ascending order
        if ("priceLowToHigh".equalsIgnoreCase(sortBy)) {
            products.sort(Comparator.comparing(Product::getPrice)); // Sort by price (low to high)
        }
        // Sort by price in descending order
        else if ("priceHighToLow".equalsIgnoreCase(sortBy)) {
            products.sort(Comparator.comparing(Product::getPrice).reversed()); // Sort by price (high to low)
        }
        /**
         * // Sort by popularity (calculated score)
         *         else if ("popularity".equalsIgnoreCase(sortBy)) {
         *             // Sort by popularity score (higher score comes first)
         *             products.sort((p1, p2) -> Double.compare(
         *                     calculatePopularityScore(p2), calculatePopularityScore(p1)));
         *         }
         */

        return products; // Return the sorted list of products
    }

}
