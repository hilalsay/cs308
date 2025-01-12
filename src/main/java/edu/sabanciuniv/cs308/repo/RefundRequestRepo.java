package edu.sabanciuniv.cs308.repo;

import edu.sabanciuniv.cs308.model.RefundRequest;
import edu.sabanciuniv.cs308.model.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefundRequestRepo extends JpaRepository<RefundRequest, UUID> {
    List<RefundRequest> findAllByStatus(RefundStatus status);

    Optional<RefundRequest> findById(UUID id);
    List<RefundRequest> findAllByOrderId(UUID orderId);
    List<RefundRequest> findByOrderIdAndProductId(UUID orderId, UUID productId);


}


