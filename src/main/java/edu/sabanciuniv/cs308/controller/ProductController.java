package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService service;

    // Endpoint to get only in-stock products
    @GetMapping("/in-stock")
    public List<Product> getProductsInStock() {
        return service.getProductsInStock();
    }

    @GetMapping
    public List<Product> getProducts(){
        return service.getProducts();
    }

    @GetMapping("/{productId}")
    public Product getProductById(@PathVariable UUID productId){
        return service.getProductById(productId);
    }

    @PostMapping
    public void addProduct(@RequestBody Product product){
        service.addProduct(product);
    }

    @PutMapping
    public void updateProduct(@RequestBody Product product){
        service.updateProduct(product);
    }

    @DeleteMapping
    public void deleteProduct(@PathVariable UUID productId){
        service.deleteProduct(productId);
    }
}
