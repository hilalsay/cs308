package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Category;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepo repo;

    public List<Product> getCategoryById(UUID categoryId) {
        Category category = repo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return category.getProducts();
    }

    public Category addCategory(Category category) {
        return repo.save(category);
    }

    public Category updateCategory(UUID id, Category categoryDetails) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        return repo.save(category);
    }

    public void deleteCategory(UUID id) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        repo.delete(category);
    }

    public List<Category> getAllCategories() {
        return repo.findAll();
    }

    public List<Product> getSortedProductsInCategory(UUID categoryId, String sortBy) {
        // Kategorideki ürünleri veri tabanından al
        List<Product> products = repo.findProductsByCategoryId(categoryId);

        // Eğer ürün listesi boşsa veya kategoriye ait ürün yoksa, boş listeyi geri döndür
        if (products == null || products.isEmpty()) {
            return products; // Geri dönen liste null değil, boş olmalıdır.
        }

        // Sıralama kriterine göre ürünleri sırala
        if ("priceLowToHigh".equalsIgnoreCase(sortBy)) {
            // Fiyat artan sırada
            products.sort(Comparator.comparing(Product::getPrice));
        } else if ("priceHighToLow".equalsIgnoreCase(sortBy)) {
            // Fiyat azalan sırada
            products.sort(Comparator.comparing(Product::getPrice).reversed());
        } else if ("popularity".equalsIgnoreCase(sortBy)) {
            // Popülerlik azalan sırada
            products.sort(Comparator.comparing(Product::getPopularity).reversed());
        }

        // Eğer hiçbir kriter eşleşmezse sıralama yapılmaz, ürünler mevcut sıralama ile döner.
        return products;
    }

}