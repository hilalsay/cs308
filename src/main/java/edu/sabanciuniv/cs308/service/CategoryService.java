package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

public class CategoryService {
    @Autowired
    private CategoryRepo repo;

    public List<Product> getProductsByCategory(UUID categoryId){
        return repo.findByCategoryId(categoryId);
    }
}
