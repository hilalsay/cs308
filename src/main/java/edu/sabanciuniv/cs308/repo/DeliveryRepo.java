package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface DeliveryRepo extends JpaRepository<Delivery, UUID> {
    // Custom query methods if needed
}
