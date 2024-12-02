package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @InjectMocks
    private ProductService productService; // Service under test

    @Mock
    private ProductRepo productRepo; // Mocked repository for simulating database operations

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialize mocks before each test
    }

    @Test
    void testGetProducts() {
        // Mock data
        List<Product> mockProducts = Arrays.asList(
                new Product("Product1", "Model1", "SN1", "Desc1", 10, BigDecimal.valueOf(100), "Warranty1", "Distributor1", "image1", "image/jpeg", 4.5, null, null, null, null),
                new Product("Product2", "Model2", "SN2", "Desc2", 5, BigDecimal.valueOf(200), "Warranty2", "Distributor2", "image2", "image/png", 3.5, null, null, null, null)
        );

        when(productRepo.findAll()).thenReturn(mockProducts);

        // Call the method to test
        List<Product> products = productService.getProducts();

        // Verify the behavior and assert results
        assertEquals(2, products.size());
        assertEquals("Product1", products.get(0).getName());
        assertEquals("Product2", products.get(1).getName());
        verify(productRepo, times(1)).findAll(); // Verify that findAll() was called once
    }

    @Test
    void testGetProductById() {
        UUID productId = UUID.randomUUID();
        Product mockProduct = new Product("Product1", "Model1", "SN1", "Desc1", 10, BigDecimal.valueOf(100), "Warranty1", "Distributor1", "image1", "image/jpeg", 4.5, null, null, null, null);

        when(productRepo.findById(productId)).thenReturn(Optional.of(mockProduct));

        // Call the method to test
        Product product = productService.getProductById(productId);

        // Assert and verify
        assertNotNull(product);
        assertEquals("Product1", product.getName());
        verify(productRepo, times(1)).findById(productId);
    }

    @Test
    void testAddProduct() throws Exception {
        Product product = new Product();
        product.setName("New Product");

        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("image.jpg");
        when(mockFile.getContentType()).thenReturn("image/jpeg");
        when(mockFile.getBytes()).thenReturn(new byte[]{1, 2, 3});

        when(productRepo.save(any(Product.class))).thenReturn(product);

        // Call the method to test
        Product savedProduct = productService.addProduct(product, mockFile);

        // Assert results and verify
        assertEquals("New Product", savedProduct.getName());
        assertEquals("image.jpg", savedProduct.getImageName());
        verify(productRepo, times(1)).save(product);
    }

    @Test
    void testDeleteProduct() {
        UUID productId = UUID.randomUUID();

        // Call the method to test
        productService.deleteProduct(productId);

        // Verify the delete operation
        verify(productRepo, times(1)).deleteById(productId);
    }

    @Test
    void testSearchProducts() {
        String keyword = "test";
        List<Product> mockProducts = Collections.singletonList(
                new Product("Test Product", "Model1", "SN1", "Desc1", 10, BigDecimal.valueOf(100), "Warranty1", "Distributor1", "image1", "image/jpeg", 4.5, null, null, null, null)
        );

        when(productRepo.searchProducts(keyword)).thenReturn(mockProducts);

        // Call the method to test
        List<Product> result = productService.searchProducts(keyword);

        // Assert and verify
        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).getName());
        verify(productRepo, times(1)).searchProducts(keyword);
    }

    @Test
    void testGetSortedProductsByPriceLowToHigh() {
        List<Product> mockProducts = Arrays.asList(
                new Product("Product1", "Model1", "SN1", "Desc1", 10, BigDecimal.valueOf(300), "Warranty1", "Distributor1", "image1", "image/jpeg", 4.5, null, null, null, null),
                new Product("Product2", "Model2", "SN2", "Desc2", 5, BigDecimal.valueOf(100), "Warranty2", "Distributor2", "image2", "image/png", 3.5, null, null, null, null)
        );

        when(productRepo.findAll()).thenReturn(mockProducts);

        // Call the method to test
        List<Product> sortedProducts = productService.getSortedProducts("priceLowToHigh");

        // Assert and verify
        assertEquals(BigDecimal.valueOf(100), sortedProducts.get(0).getPrice());
        verify(productRepo, times(1)).findAll();
    }
}
