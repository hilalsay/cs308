// ShoppingCartRepo.java
package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShoppingCartRepo extends JpaRepository<ShoppingCart, UUID> {
    Optional<ShoppingCart> findByUserId(UUID userId);

    Optional<ShoppingCart> findByUserIdAndOrderedFalse(UUID userId);

    List<ShoppingCart> findAllByUserId(UUID userId);

    List<ShoppingCart> findByUserIdAndOrderedTrue(UUID userId);


}
