package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepo extends JpaRepository<Product, UUID> {
}
