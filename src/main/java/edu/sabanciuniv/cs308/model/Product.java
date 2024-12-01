package edu.sabanciuniv.cs308.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
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
    private String imageName;
    private String imageType;
    @Column
    private Double averageRating;
    @Column
    private Integer overallRating;

    @OneToMany(mappedBy = "productId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews; // Reviews related to this product

    @Lob
    private byte[] imageData;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference // Prevents recursion by ignoring this field during serialization
    private Category category;

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
