package edu.sabanciuniv.cs308.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private String model;
    private String serialNumber;
    private String description;
    private Integer stockQuantity;
    private BigDecimal price;
    private String warrantyStatus;
    private String distributorInformation;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
