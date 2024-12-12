package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.ProductManager;
import edu.sabanciuniv.cs308.service.CategoryService;
import edu.sabanciuniv.cs308.service.ProductManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/product-manager")
public class ProductManagerController {

    @Autowired
    private ProductManagerService productManagerService;

    @Autowired
    private CategoryService categoryService;

    // Add a new category
    @PostMapping("/categories")
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        try {
            Category newCategory = categoryService.addCategory(category);
            return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete a category
    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable UUID categoryId) {
        try {
            categoryService.deleteCategory(categoryId);
            return new ResponseEntity<>("Category deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting category.", HttpStatus.BAD_REQUEST);
        }
    }

    // Add product manager (role assignment logic can be added as needed)
    @PostMapping("/assign-product-manager/{userId}")
    public ResponseEntity<?> assignProductManager(@PathVariable UUID userId) {
        // Assign ProductManager role to a user
        productManagerService.assignProductManagerRole(userId);
        return new ResponseEntity<>("Product Manager assigned successfully.", HttpStatus.OK);
    }
}
