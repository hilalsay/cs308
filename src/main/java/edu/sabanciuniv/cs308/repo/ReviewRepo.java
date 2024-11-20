package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepo extends JpaRepository<Review, UUID> {

    List<Review> findByProductId(UUID productId);

    List<Review> findByUserId(UUID userId);

    boolean existsByProductIdAndUserId(UUID productId, UUID userId);
}
