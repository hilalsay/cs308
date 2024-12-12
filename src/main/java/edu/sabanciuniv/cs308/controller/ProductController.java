package edu.sabanciuniv.cs308.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService service;

    // Endpoint to get only in-stock products
    @GetMapping("/in-stock")
    public ResponseEntity<List<Product>> getProductsInStock() {
        return new ResponseEntity<>(service.getProductsInStock(), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(){
        return new ResponseEntity<>(service.getProducts(), HttpStatus.OK);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable UUID productId){
        Product product = service.getProductById(productId);
        if (product != null)
            return new ResponseEntity<>(service.getProductById(productId), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Endpoint to get products sorted by the specified criteria (price or popularity)
    @GetMapping("/sorted")
    public ResponseEntity<List<Product>> getSortedProducts(@RequestParam String sortBy) {
        List<Product> sortedProducts = service.getSortedProducts(sortBy); // Get sorted products from service
        return new ResponseEntity<>(sortedProducts, HttpStatus.OK); // Return sorted products with OK status
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addProduct(@RequestParam("product") String productJson,
                                        @RequestParam("image") MultipartFile imageFile) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Product product = objectMapper.readValue(productJson, Product.class);

        Product savedProduct = service.addProduct(product, imageFile);

        return ResponseEntity.ok(savedProduct);}


    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Product> updateProduct(@PathVariable UUID id,
                                                 @RequestPart("product") String productJson,
                                                 @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        Product updatedProduct = service.updateProduct(id, productJson, image);

        return ResponseEntity.ok(updatedProduct);
    }


    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable UUID productId){
        Product product = service.getProductById(productId);
        if(product != null){
            service.deleteProduct(productId);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProduct(@RequestParam String keyword){
        System.out.println("searching with " + keyword);
        // Check if the keyword is null, empty, or contains only whitespace
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Return 400 Bad Request
        }

        List<Product> products = service.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
