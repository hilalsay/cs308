package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock
    private ProductRepo productRepo;

    @Mock
    private MultipartFile imageFile;

    @InjectMocks
    private ProductService productService;

    private Product sampleProduct;
    private UUID sampleProductId;

    @BeforeEach
    void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);
        sampleProductId = UUID.randomUUID();

        Category category = new Category();
        sampleProduct = new Product(
                sampleProductId,
                "Laptop",
                "X123",
                "SN123456",
                "High-end gaming laptop",
                5,
                new BigDecimal("1500.00"),
                "2 years",
                "Tech Distributors",
                "laptop.jpg",
                "image/jpeg",
                new byte[]{1, 2, 3},
                category
        );

        when(imageFile.getOriginalFilename()).thenReturn("laptop.jpg");
        when(imageFile.getContentType()).thenReturn("image/jpeg");
        when(imageFile.getBytes()).thenReturn(new byte[]{1, 2, 3});
    }

    @Test
    void addProduct_shouldSaveProductWithImage() throws IOException {
        Product product = new Product();
        product.setName("Laptop");

        // Mocklama: repo.save() çağrıldığında, 'product' nesnesini döndür.
        when(productRepo.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product savedProduct = productService.addProduct(product, imageFile);

        // Beklentiler
        assertNotNull(savedProduct); // savedProduct'ın null olmadığını doğrula
        assertEquals("laptop.jpg", savedProduct.getImageName());
        assertEquals("image/jpeg", savedProduct.getImageType());
        assertArrayEquals(new byte[]{1, 2, 3}, savedProduct.getImageData());

        // Mock nesnesinin kaydetme işlemini gerçekleştirdiğini doğrula
        verify(productRepo, times(1)).save(product);
    }


    @Test
    void updateProduct_shouldUpdateProductWithImage() throws IOException {
        // Mocklama: findById çağrıldığında sampleProduct döndür
        when(productRepo.findById(sampleProductId)).thenReturn(Optional.of(sampleProduct));

        // Mocklama: save çağrıldığında güncellenen ürünü döndür
        when(productRepo.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // updateProduct çağrısı
        Product updatedProduct = productService.updateProduct(sampleProductId, sampleProduct, imageFile);

        // Beklentiler
        assertNotNull(updatedProduct); // updatedProduct'ın null olmadığını doğrula
        assertEquals("laptop.jpg", updatedProduct.getImageName());
        assertEquals("image/jpeg", updatedProduct.getImageType());
        assertArrayEquals(new byte[]{1, 2, 3}, updatedProduct.getImageData());

        // Mock nesnelerinin doğru şekilde çağrıldığını doğrula
        verify(productRepo, times(1)).findById(sampleProductId);
        verify(productRepo, times(1)).save(sampleProduct);
    }


    @Test
    void getProducts_shouldReturnAllProducts() {
        List<Product> mockProducts = new ArrayList<>();
        mockProducts.add(sampleProduct);
        when(productRepo.findAll()).thenReturn(mockProducts);

        List<Product> products = productService.getProducts();

        assertEquals(1, products.size());
        assertEquals("Laptop", products.get(0).getName());
        verify(productRepo, times(1)).findAll();
    }

    @Test
    void getProductsInStock_shouldReturnOnlyInStockProducts() {
        List<Product> productsInStock = new ArrayList<>();
        productsInStock.add(sampleProduct);
        when(productRepo.findByStockQuantityGreaterThan(0)).thenReturn(productsInStock);

        List<Product> result = productService.getProductsInStock();

        assertEquals(1, result.size());
        assertTrue(result.get(0).getStockQuantity() > 0);
        verify(productRepo, times(1)).findByStockQuantityGreaterThan(0);
    }

    @Test
    void getProductById_shouldReturnProduct_whenProductExists() {
        when(productRepo.findById(sampleProductId)).thenReturn(Optional.of(sampleProduct));

        Product product = productService.getProductById(sampleProductId);

        assertNotNull(product);
        assertEquals("Laptop", product.getName());
        verify(productRepo, times(1)).findById(sampleProductId);
    }

    @Test
    void getProductById_shouldThrowException_whenProductDoesNotExist() {
        when(productRepo.findById(sampleProductId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.getProductById(sampleProductId);
        });

        assertEquals("Product not found", exception.getMessage());
        verify(productRepo, times(1)).findById(sampleProductId);
    }

    @Test
    void deleteProduct_shouldDeleteProductById() {
        productService.deleteProduct(sampleProductId);

        verify(productRepo, times(1)).deleteById(sampleProductId);
    }
}
