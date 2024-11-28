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
    @Getter
    private int popularity;

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

    public int getPopularity() {
        return this.popularity;
    }


//    @OneToMany(mappedBy = "product")
//    private List<Order> orders; // Assuming you have an Order class that tracks product sales
//     @OneToMany(mappedBy = "product")
//    private List<Rating> ratings; // Assuming you have a Rating class that stores user ratings for products

/**
 *
 public double getSalesCount() {
 return orders != null ? orders.size() : 0; // If orders are stored in a list, return the size.
 }
 */

/**
 *     public double getAverageRating() {
 *         if (ratings != null && !ratings.isEmpty()) {
 *             double sum = 0;
 *             for (Rating rating : ratings) {
 *                 sum += rating.getRatingValue(); // Assuming each Rating has a `getRatingValue()` method
 *             }
 *             return sum / ratings.size();
 *         }
 *         return 0; // If no ratings exist, return 0 or a default value.
 *         }
 */

}
