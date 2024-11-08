package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.CategoryRepo;
import edu.sabanciuniv.cs308.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
    @Autowired
    private CategoryService service;

    @GetMapping("/{categoryId}")
    public List<Product> getCategoryById(@PathVariable UUID categoryId){
        return service.getCategoryById(categoryId);
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return service.addCategory(category);
    }

    @PutMapping("/{categoryId}")
    public Category updateCategory(@PathVariable UUID categoryId, @RequestBody Category categoryDetails) {
        return service.updateCategory(categoryId, categoryDetails);
    }

    @DeleteMapping("/{categoryId}")
    public void deleteCategory(@PathVariable UUID categoryId) {
        service.deleteCategory(categoryId);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return service.getAllCategories();
    }

}
