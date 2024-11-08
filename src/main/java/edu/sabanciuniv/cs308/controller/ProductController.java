package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductByCategory(@PathVariable UUID categoryId){
        return service.getProductsByCategory(categoryId);
    }
}
