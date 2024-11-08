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

    public Product getProductById(UUID productId) {
        return repo.findById(productId).orElse(new Product());
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
