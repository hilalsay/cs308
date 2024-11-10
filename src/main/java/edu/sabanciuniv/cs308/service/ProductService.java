package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public void addProduct(Product product) {
        repo.save(product);
    }


    public void updateProduct(Product product) {
        repo.save(product);
    }



    public void deleteProduct(UUID productId) {
        repo.deleteById(productId);
    }
}
