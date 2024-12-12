package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.ProductManager;
import edu.sabanciuniv.cs308.repo.ProductManagerRepo;
import edu.sabanciuniv.cs308.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProductManagerService {

    @Autowired
    private ProductManagerRepo productManagerRepo;

    @Autowired
    private UserRepo userRepo;  // Assuming you have a User repository to get user data

    // Assign product manager role to a user
    public void assignProductManagerRole(UUID userId) {
        // Check if the user exists
        var user = userRepo.findById(userId).orElse(null);
        if (user != null) {
            ProductManager productManager = new ProductManager();
            productManager.setUser(user); // Assign the user to the product manager
            productManagerRepo.save(productManager);  // Save the product manager role
        }
    }
}
