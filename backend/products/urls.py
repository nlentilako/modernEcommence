"""URLs for the products app."""
from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<uuid:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('brands/', views.BrandListView.as_view(), name='brand-list'),
    path('brands/<uuid:pk>/', views.BrandDetailView.as_view(), name='brand-detail'),
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<uuid:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('products/<uuid:product_id>/reviews/', views.ProductReviewListView.as_view(), name='product-review-list'),
    path('products/<uuid:product_id>/reviews/<uuid:pk>/', views.ProductReviewDetailView.as_view(), name='product-review-detail'),
    path('featured/', views.featured_products, name='featured-products'),
    path('trending/', views.trending_products, name='trending-products'),
    path('recently-viewed/', views.recently_viewed_products, name='recently-viewed-products'),
    path('top-rated/', views.top_rated_products, name='top-rated-products'),
    path('frequently-purchased/', views.frequently_purchased_products, name='frequently-purchased-products'),
]