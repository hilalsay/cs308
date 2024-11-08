package edu.sabanciuniv.cs308.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.UUID;

@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private String model;
    private int serialNumber;
    private String description;
    private int stockQuantity;
    private double price;
    private String warrantyStatus;
    private String distributorInformation;
}
