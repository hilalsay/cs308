package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<User, UUID> {
}
