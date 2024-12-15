package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.SalesManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SalesManagerRepo extends JpaRepository<SalesManager, UUID> {
    // Custom query methods can be added here if needed, e.g., find by specific fields.
}
