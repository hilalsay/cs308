package edu.sabanciuniv.cs308.controller;

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

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product, @RequestPart MultipartFile imageFile){
        try {
            Product product1 = service.addProduct(product, imageFile);
            return new ResponseEntity<>(product1, HttpStatus.CREATED);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<String> updateProduct(@PathVariable UUID productId,
                                                @RequestPart Product product,
                                                @RequestPart MultipartFile imageFile)
    {
        Product product1 = null;
        try {
            product1 = service.updateProduct(productId, product, imageFile);
        } catch (IOException e) {
            return new ResponseEntity<>("Fail to update", HttpStatus.BAD_REQUEST);
        }
        if (product1 != null){
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Fail to update", HttpStatus.BAD_REQUEST);
        }
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
        List<Product> products = service.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
