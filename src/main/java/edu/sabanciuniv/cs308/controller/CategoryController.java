package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.CategoryRepo;
import edu.sabanciuniv.cs308.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
    @Autowired
    private CategoryService service;

    @GetMapping("/{categoryId}")
    public List<Product> getProductByCategory(@PathVariable UUID categoryId){
        return service.getProductsByCategory(categoryId);
    }
}
