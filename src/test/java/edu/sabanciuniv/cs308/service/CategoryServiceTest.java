package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.CategoryRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepo categoryRepo;

    @InjectMocks
    private CategoryService categoryService;

    private Category category;
    private UUID categoryId;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        categoryId = UUID.randomUUID();
        category = new Category();
        category.setId(categoryId);
        category.setName("Electronics");
        category.setDescription("All electronic items");
        category.setProducts(new ArrayList<>());
    }

    @Test
    public void testGetCategoryById() {
        when(categoryRepo.findById(categoryId)).thenReturn(Optional.of(category));

        List<Product> products = categoryService.getCategoryById(categoryId);

        assertNotNull(products);
        assertEquals(0, products.size());
        verify(categoryRepo, times(1)).findById(categoryId);
    }

    @Test
    public void testGetCategoryByIdNotFound() {
        when(categoryRepo.findById(categoryId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            categoryService.getCategoryById(categoryId);
        });

        assertEquals("Category not found", exception.getMessage());
        verify(categoryRepo, times(1)).findById(categoryId);
    }

    @Test
    public void testAddCategory() {
        when(categoryRepo.save(category)).thenReturn(category);

        Category savedCategory = categoryService.addCategory(category);

        assertNotNull(savedCategory);
        assertEquals("Electronics", savedCategory.getName());
        verify(categoryRepo, times(1)).save(category);
    }

    @Test
    public void testUpdateCategory() {
        when(categoryRepo.findById(categoryId)).thenReturn(Optional.of(category));
        when(categoryRepo.save(category)).thenReturn(category);

        Category updatedCategoryDetails = new Category();
        updatedCategoryDetails.setName("Updated Electronics");
        updatedCategoryDetails.setDescription("Updated description");

        Category updatedCategory = categoryService.updateCategory(categoryId, updatedCategoryDetails);

        assertEquals("Updated Electronics", updatedCategory.getName());
        assertEquals("Updated description", updatedCategory.getDescription());
        verify(categoryRepo, times(1)).findById(categoryId);
        verify(categoryRepo, times(1)).save(category);
    }

    @Test
    public void testUpdateCategoryNotFound() {
        when(categoryRepo.findById(categoryId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            categoryService.updateCategory(categoryId, category);
        });

        assertEquals("Category not found", exception.getMessage());
        verify(categoryRepo, times(1)).findById(categoryId);
        verify(categoryRepo, times(0)).save(category);
    }

    @Test
    public void testDeleteCategory() {
        when(categoryRepo.findById(categoryId)).thenReturn(Optional.of(category));

        categoryService.deleteCategory(categoryId);

        verify(categoryRepo, times(1)).findById(categoryId);
        verify(categoryRepo, times(1)).delete(category);
    }

    @Test
    public void testDeleteCategoryNotFound() {
        when(categoryRepo.findById(categoryId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            categoryService.deleteCategory(categoryId);
        });

        assertEquals("Category not found", exception.getMessage());
        verify(categoryRepo, times(1)).findById(categoryId);
        verify(categoryRepo, times(0)).delete(category);
    }

    @Test
    public void testGetAllCategories() {
        List<Category> categories = new ArrayList<>();
        categories.add(category);

        when(categoryRepo.findAll()).thenReturn(categories);

        List<Category> result = categoryService.getAllCategories();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(categoryRepo, times(1)).findAll();
    }
}
