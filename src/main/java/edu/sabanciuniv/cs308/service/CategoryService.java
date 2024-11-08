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
}
