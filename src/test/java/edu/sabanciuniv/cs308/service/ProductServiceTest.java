package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import edu.sabanciuniv.cs308.repo.WishlistRepo;
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
    private WishlistRepo wishlistRepo;

    @Mock
    private EmailSender emailSender;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetProducts() {
        List<Product> mockProducts = new ArrayList<>();
        mockProducts.add(new Product());
        when(productRepo.findByIsDeletedFalse()).thenReturn(mockProducts);

        List<Product> products = productService.getProducts();

        assertNotNull(products);
        assertEquals(1, products.size());
        verify(productRepo, times(1)).findByIsDeletedFalse();
    }

    @Test
    void testGetProductById() {
        UUID productId = UUID.randomUUID();
        Product mockProduct = new Product();
        mockProduct.setId(productId);

        when(productRepo.findById(productId)).thenReturn(Optional.of(mockProduct));

        Product product = productService.getProductById(productId);

        assertNotNull(product);
        assertEquals(productId, product.getId());
        verify(productRepo, times(1)).findById(productId);
    }

    @Test
    void testAddProduct() throws IOException {
        Product product = new Product();
        product.setName("Test Product");

        MultipartFile image = mock(MultipartFile.class);
        when(image.isEmpty()).thenReturn(false);
        when(image.getOriginalFilename()).thenReturn("image.jpg");
        when(image.getContentType()).thenReturn("image/jpeg");
        when(image.getBytes()).thenReturn(new byte[]{1, 2, 3});

        when(productRepo.save(any(Product.class))).thenReturn(product);

        Product addedProduct = productService.addProduct(product, image);

        assertNotNull(addedProduct);
        assertEquals("Test Product", addedProduct.getName());
        verify(productRepo, times(1)).save(product);
    }

    @Test
    void testUpdateProductPrice() {
        UUID productId = UUID.randomUUID();
        Product mockProduct = new Product();
        mockProduct.setId(productId);
        mockProduct.setPrice(BigDecimal.valueOf(100));

        when(productRepo.findById(productId)).thenReturn(Optional.of(mockProduct));
        when(productRepo.save(any(Product.class))).thenReturn(mockProduct);

        Product updatedProduct = productService.updateProductPrice(productId, BigDecimal.valueOf(150));

        assertNotNull(updatedProduct);
        assertEquals(BigDecimal.valueOf(150), updatedProduct.getPrice());
        verify(productRepo, times(1)).save(mockProduct);
    }

    @Test
    void testUpdateProductDiscount() {
        UUID productId = UUID.randomUUID();
        Product mockProduct = new Product();
        mockProduct.setId(productId);
        mockProduct.setPrice(BigDecimal.valueOf(200));

        when(productRepo.findById(productId)).thenReturn(Optional.of(mockProduct));
        when(productRepo.save(any(Product.class))).thenReturn(mockProduct);

        Product updatedProduct = productService.updateProductDiscount(productId, 20.0);

        assertNotNull(updatedProduct);
        assertEquals(Double.valueOf(20.0), updatedProduct.getDiscountRate());
        assertEquals(BigDecimal.valueOf(160.0), updatedProduct.getDiscountedPrice());
        verify(productRepo, times(1)).save(mockProduct);
    }

    @Test
    void testRemoveProductDiscount() {
        UUID productId = UUID.randomUUID();
        Product mockProduct = new Product();
        mockProduct.setId(productId);
        mockProduct.setDiscountedPrice(BigDecimal.valueOf(150));
        mockProduct.setDiscountRate(20.0);

        when(productRepo.findById(productId)).thenReturn(Optional.of(mockProduct));
        when(productRepo.save(any(Product.class))).thenReturn(mockProduct);

        Product updatedProduct = productService.removeProductDiscount(productId);

        assertNotNull(updatedProduct);
        assertNull(updatedProduct.getDiscountedPrice());
        assertNull(updatedProduct.getDiscountRate());
        verify(productRepo, times(1)).save(mockProduct);
    }

    @Test
    void testDeleteProduct() {
        UUID productId = UUID.randomUUID();

        doNothing().when(productRepo).deleteById(productId);

        productService.deleteProduct(productId);

        verify(productRepo, times(1)).deleteById(productId);
    }

    @Test
    void testMarkProductAsDeleted() {
        UUID productId = UUID.randomUUID();
        Product mockProduct = new Product();
        mockProduct.setId(productId);
        mockProduct.setIsDeleted(false);

        when(productRepo.findById(productId)).thenReturn(Optional.of(mockProduct));
        when(productRepo.save(any(Product.class))).thenReturn(mockProduct);

        productService.markProductAsDeleted(productId);

        assertTrue(mockProduct.getIsDeleted());
        verify(productRepo, times(1)).save(mockProduct);
    }

    @Test
    void testGetProductsInStock() {
        List<Product> mockProducts = new ArrayList<>();
        Product productInStock = new Product();
        productInStock.setStockQuantity(10);
        mockProducts.add(productInStock);

        when(productRepo.findByStockQuantityGreaterThan(0)).thenReturn(mockProducts);

        List<Product> productsInStock = productService.getProductsInStock();

        assertNotNull(productsInStock);
        assertEquals(1, productsInStock.size());
        assertEquals(10, productsInStock.get(0).getStockQuantity());
        verify(productRepo, times(1)).findByStockQuantityGreaterThan(0);
    }

    @Test
    void testSearchProducts() {
        String keyword = "laptop";
        List<Product> mockProducts = new ArrayList<>();
        Product product = new Product();
        product.setName("Laptop XYZ");
        mockProducts.add(product);

        when(productRepo.searchProducts(keyword)).thenReturn(mockProducts);

        List<Product> searchResults = productService.searchProducts(keyword);

        assertNotNull(searchResults);
        assertEquals(1, searchResults.size());
        assertEquals("Laptop XYZ", searchResults.get(0).getName());
        verify(productRepo, times(1)).searchProducts(keyword);
    }

    @Test
    void testGetSortedProductsByPriceLowToHigh() {
        List<Product> mockProducts = new ArrayList<>();
        Product product1 = new Product();
        product1.setPrice(BigDecimal.valueOf(50));
        Product product2 = new Product();
        product2.setPrice(BigDecimal.valueOf(100));
        mockProducts.add(product2);
        mockProducts.add(product1);

        when(productRepo.findAll()).thenReturn(mockProducts);

        List<Product> sortedProducts = productService.getSortedProducts("priceLowToHigh");

        assertNotNull(sortedProducts);
        assertEquals(50, sortedProducts.get(0).getPrice().intValue());
        assertEquals(100, sortedProducts.get(1).getPrice().intValue());
        verify(productRepo, times(1)).findAll();
    }
}
