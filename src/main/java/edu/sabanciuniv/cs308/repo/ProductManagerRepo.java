package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.ProductManager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductManagerRepo extends JpaRepository<ProductManager, UUID> {
    // Add custom queries if needed
}
