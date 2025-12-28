"""Views for the products app."""
from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Avg
from django.utils import timezone
from django.core.cache import cache
from .models import Category, Brand, Product, ProductImage, ProductReview, ProductView, ProductSearch
from .serializers import (
    CategorySerializer, BrandSerializer, ProductSerializer, 
    ProductListSerializer, ProductReviewSerializer, ProductSearchSerializer
)
from .permissions import IsAdminOrReadOnly
from .utils import track_product_view, track_search


class CategoryListView(generics.ListCreateAPIView):
    """View for listing and creating categories."""
    
    queryset = Category.objects.filter(is_active=True, is_deleted=False)
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting a category."""
    
    queryset = Category.objects.filter(is_active=True, is_deleted=False)
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class BrandListView(generics.ListCreateAPIView):
    """View for listing and creating brands."""
    
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']


class BrandDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting a brand."""
    
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    permission_classes = [IsAdminOrReadOnly]


class ProductListView(generics.ListCreateAPIView):
    """View for listing and creating products."""
    
    serializer_class = ProductListSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'is_active', 'is_featured', 'is_trending']
    search_fields = ['name', 'description', 'sku', 'barcode']
    ordering_fields = ['price', 'created_at', 'rating', 'discount_percent']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True, is_deleted=False)
        
        # Price range filter
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Rating filter
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        # Track search if query params exist
        search_query = request.query_params.get('search', '')
        if search_query:
            track_search(
                query=search_query,
                user=request.user if request.user.is_authenticated else None,
                session_key=request.session.session_key,
                ip_address=self.get_client_ip(request),
                results_count=self.get_queryset().count()
            )
        
        return super().list(request, *args, **kwargs)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting a product."""
    
    queryset = Product.objects.filter(is_active=True, is_deleted=False)
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Track product view
        track_product_view(
            product=instance,
            user=request.user if request.user.is_authenticated else None,
            session_key=request.session.session_key,
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ProductReviewListView(generics.ListCreateAPIView):
    """View for listing and creating product reviews."""
    
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return ProductReview.objects.filter(
            product_id=product_id, 
            is_approved=True
        ).select_related('user')
    
    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)


class ProductReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting a product review."""
    
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        product_id = self.kwargs['product_id']
        review_id = self.kwargs['pk']
        return ProductReview.objects.filter(
            product_id=product_id,
            id=review_id,
            user=self.request.user
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_products(request):
    """Get featured products."""
    cache_key = 'featured_products'
    products = cache.get(cache_key)
    
    if not products:
        products = Product.objects.filter(
            is_active=True, 
            is_deleted=False, 
            is_featured=True
        )[:10]
        serializer = ProductListSerializer(products, many=True)
        products = serializer.data
        cache.set(cache_key, products, 300)  # Cache for 5 minutes
    
    return Response(products)


@api_view(['GET'])
@permission_classes([AllowAny])
def trending_products(request):
    """Get trending products."""
    cache_key = 'trending_products'
    products = cache.get(cache_key)
    
    if not products:
        products = Product.objects.filter(
            is_active=True, 
            is_deleted=False, 
            is_trending=True
        ).order_by('-rating')[:10]
        serializer = ProductListSerializer(products, many=True)
        products = serializer.data
        cache.set(cache_key, products, 300)  # Cache for 5 minutes
    
    return Response(products)


@api_view(['GET'])
@permission_classes([AllowAny])
def recently_viewed_products(request):
    """Get recently viewed products for the user."""
    if not request.user.is_authenticated:
        return Response([])
    
    # Get the 5 most recently viewed products
    viewed_products = ProductView.objects.filter(
        user=request.user
    ).select_related('product').order_by('-timestamp')[:5]
    
    product_ids = [pv.product.id for pv in viewed_products]
    products = Product.objects.filter(
        id__in=product_ids,
        is_active=True,
        is_deleted=False
    )
    
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def top_rated_products(request):
    """Get top-rated products."""
    cache_key = 'top_rated_products'
    products = cache.get(cache_key)
    
    if not products:
        products = Product.objects.filter(
            is_active=True,
            is_deleted=False
        ).order_by('-rating')[:10]
        serializer = ProductListSerializer(products, many=True)
        products = serializer.data
        cache.set(cache_key, products, 300)  # Cache for 5 minutes
    
    return Response(products)


@api_view(['GET'])
@permission_classes([AllowAny])
def frequently_purchased_products(request):
    """Get frequently purchased products."""
    # This would typically come from order data
    # For now, we'll return products with the most reviews as a proxy
    products = Product.objects.filter(
        is_active=True,
        is_deleted=False
    ).annotate(
        review_count=Count('reviews')
    ).order_by('-review_count')[:10]
    
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)