package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock
    private ProductRepo repo;

    @InjectMocks
    private ProductService productService;

    private Product sampleProduct;
    private UUID sampleProductId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleProductId = UUID.randomUUID();

        Category sampleCategory = new Category();
        sampleProduct = new Product("Laptop", "X123", "SN123456", "High-end gaming laptop",
                5, new BigDecimal("1500.00"), "2 years", "Tech Distributors", sampleCategory);
        sampleProduct.setId(sampleProductId);
    }

    @Test
    void getProducts_shouldReturnAllProducts() {
        // Arrange
        List<Product> mockProducts = new ArrayList<>();
        mockProducts.add(sampleProduct);
        when(repo.findAll()).thenReturn(mockProducts);

        // Act
        List<Product> products = productService.getProducts();

        // Assert
        assertEquals(1, products.size());
        assertEquals("Laptop", products.get(0).getName());
        verify(repo, times(1)).findAll();
    }

    @Test
    void getProductsInStock_shouldReturnOnlyInStockProducts() {
        // Arrange
        List<Product> mockProductsInStock = new ArrayList<>();
        mockProductsInStock.add(sampleProduct);
        when(repo.findByStockQuantityGreaterThan(0)).thenReturn(mockProductsInStock);

        // Act
        List<Product> productsInStock = productService.getProductsInStock();

        // Assert
        assertEquals(1, productsInStock.size());
        assertTrue(productsInStock.get(0).getStockQuantity() > 0);
        assertEquals("Laptop", productsInStock.get(0).getName());
        verify(repo, times(1)).findByStockQuantityGreaterThan(0);
    }

    @Test
    void getProductById_shouldReturnProduct_whenProductExists() {
        // Arrange
        when(repo.findById(sampleProductId)).thenReturn(Optional.of(sampleProduct));

        // Act
        Product product = productService.getProductById(sampleProductId);

        // Assert
        assertNotNull(product);
        assertEquals("Laptop", product.getName());
        assertEquals("X123", product.getModel());
        assertEquals("SN123456", product.getSerialNumber());
        assertEquals("High-end gaming laptop", product.getDescription());
        assertEquals(5, product.getStockQuantity());
        assertEquals(new BigDecimal("1500.00"), product.getPrice());
        assertEquals("2 years", product.getWarrantyStatus());
        assertEquals("Tech Distributors", product.getDistributorInformation());
        verify(repo, times(1)).findById(sampleProductId);
    }

    @Test
    void getProductById_shouldThrowException_whenProductDoesNotExist() {
        // Arrange
        when(repo.findById(sampleProductId)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            productService.getProductById(sampleProductId);
        });
        assertEquals("Product not found", exception.getMessage());
        verify(repo, times(1)).findById(sampleProductId);
    }

    @Test
    void addProduct_shouldSaveProduct() {
        // Act
        productService.addProduct(sampleProduct);

        // Assert
        verify(repo, times(1)).save(sampleProduct);
    }

    @Test
    void updateProduct_shouldUpdateProduct() {
        // Act
        productService.updateProduct(sampleProduct);

        // Assert
        verify(repo, times(1)).save(sampleProduct);
    }

    @Test
    void deleteProduct_shouldDeleteProductById() {
        // Act
        productService.deleteProduct(sampleProductId);

        // Assert
        verify(repo, times(1)).deleteById(sampleProductId);
    }
}
