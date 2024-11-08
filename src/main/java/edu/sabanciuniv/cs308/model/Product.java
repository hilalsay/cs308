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

    public Product(String name, String model, String serialNumber,
                   String description, Integer stockQuantity,
                   BigDecimal price, String warrantyStatus,
                   String distributorInformation, Category category) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.model = model;
        this.serialNumber = serialNumber;
        this.description = description;
        this.stockQuantity = stockQuantity;
        this.price = price;
        this.warrantyStatus = warrantyStatus;
        this.distributorInformation = distributorInformation;
        this.category = category;
    }

    public Product() {
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", model='" + model + '\'' +
                ", serialNumber='" + serialNumber + '\'' +
                ", description='" + description + '\'' +
                ", stockQuantity=" + stockQuantity +
                ", price=" + price +
                ", warrantyStatus='" + warrantyStatus + '\'' +
                ", distributorInformation='" + distributorInformation + '\'' +
                ", category=" + category +
                '}';
    }
}
