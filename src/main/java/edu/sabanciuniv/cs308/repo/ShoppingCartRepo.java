package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShoppingCartRepo extends JpaRepository<ShoppingCart, Long> {
    Optional<ShoppingCart> findByUser(User user);  // Accepts a User object
}
