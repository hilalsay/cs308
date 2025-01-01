package edu.sabanciuniv.cs308.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private String description;
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Product> products;

    // Custom method to mark the category as deleted (soft delete)
    public void markAsDeleted() {
        this.isDeleted = true;
        for (Product product : products) {
            product.setIsDeleted(true); // Soft delete related products
        }
    }
}
