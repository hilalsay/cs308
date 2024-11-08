package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepo extends JpaRepository<User, UUID> {
}
