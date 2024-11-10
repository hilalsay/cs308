package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepo repo;

    public List<Product> getCategoryById(UUID categoryId) {
        Category category = repo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return category.getProducts();
    }

    public Category addCategory(Category category) {
        return repo.save(category);
    }

    public Category updateCategory(UUID id, Category categoryDetails) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        return repo.save(category);
    }

    public void deleteCategory(UUID id) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        repo.delete(category);
    }

    public List<Category> getAllCategories() {
        return repo.findAll();
    }
}