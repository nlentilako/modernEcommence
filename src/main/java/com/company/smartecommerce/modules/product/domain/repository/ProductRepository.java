package com.company.smartecommerce.modules.product.domain.repository;

import com.company.smartecommerce.modules.product.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    List<Product> findByIsActiveTrue();
    Page<Product> findByIsActiveTrue(Pageable pageable);
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    Page<Product> findActiveByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    Page<Product> searchByNameOrDescription(@Param("keyword") String keyword, Pageable pageable);
}