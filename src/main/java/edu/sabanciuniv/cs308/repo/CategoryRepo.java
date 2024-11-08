package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepo extends JpaRepository<Category, UUID> {
    List<Product> findByCategoryId(UUID categoryId);
}
