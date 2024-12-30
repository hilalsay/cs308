package edu.sabanciuniv.cs308.repository;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.Wishlist;
import edu.sabanciuniv.cs308.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WishlistRepo extends JpaRepository<Wishlist, UUID> {
    // Find a wishlist by the associated user ID
    Optional<Wishlist> findByUserId(UUID userId);

    // Alternatively, find a wishlist by the associated user (based on your model)
    Optional<Wishlist> findByUser(User user);

    List<Wishlist> findAllByProductsContains(Product product);
}
