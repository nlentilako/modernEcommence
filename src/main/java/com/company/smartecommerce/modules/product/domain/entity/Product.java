package com.company.smartecommerce.modules.product.domain.entity;

import com.company.smartecommerce.common.base.BaseEntity;
import com.company.smartecommerce.modules.category.domain.entity.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stockQuantity = 0;

    @Column(nullable = false)
    private String sku;

    @Column
    private String imageUrl;

    @Column
    private String brand;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column
    private Double averageRating = 0.0;

    @Column
    private Integer totalReviews = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<com.company.smartecommerce.modules.review.domain.entity.Review> reviews;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<com.company.smartecommerce.modules.inventory.domain.entity.Inventory> inventories;
}