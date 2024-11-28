package edu.sabanciuniv.cs308.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product; // The product being rated

    private double ratingValue; // The rating value (e.g., 1-5 or any range you decide)

    private String reviewerName; // Optional field for the name of the person giving the rating (if available)

    private String reviewComment; // Optional field for any review comment

    // You can add more fields as per your requirements, such as review date, user id, etc.
}
