package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.CartItem;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepo extends JpaRepository<CartItem, UUID> {

    // Find CartItem by ShoppingCart and Product
    Optional<CartItem> findByShoppingCartAndProduct(ShoppingCart shoppingCart, Product product);
}
