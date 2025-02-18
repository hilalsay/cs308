package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.CategoryRepo;
import edu.sabanciuniv.cs308.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
    @Autowired
    private CategoryService service;

    @GetMapping("/{categoryId}")
    public ResponseEntity<List<Product>> getCategoryById(@PathVariable UUID categoryId) {
        return new ResponseEntity<>(service.getCategoryById(categoryId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        try {
            Category category1 = service.addCategory(category);
            return new ResponseEntity<>(category1, HttpStatus.CREATED);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<String> updateCategory(@PathVariable UUID categoryId, @RequestBody Category categoryDetails) {
        Category category1 = service.updateCategory(categoryId, categoryDetails);
        if (category1 != null){
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Fail to update", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable UUID categoryId) {
        service.markCategoryAndProductsAsDeleted(categoryId);
        return new ResponseEntity<>("Deleted", HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        // Filter categories where isDeleted is false
        List<Category> categories = service.getAllCategories().stream()
                .filter(category -> Boolean.FALSE.equals(category.getIsDeleted())) // Ensure it's not null
                .collect(Collectors.toList());
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }


    @GetMapping("/products/sorted")
    public ResponseEntity<List<Product>> getSortedProductsInCategory(
            @RequestParam UUID categoryId,  // Use @RequestParam instead of @PathVariable
            @RequestParam String sortBy) {
        List<Product> sortedProducts = service.getSortedProductsInCategory(categoryId, sortBy);
        return new ResponseEntity<>(sortedProducts, HttpStatus.OK);
    }
}
