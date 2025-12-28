"""Serializers for the products app."""
from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, ProductReview, ProductView, ProductSearch


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for category model."""
    
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('id', 'slug', 'created_at', 'updated_at', 'is_deleted')


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for brand model."""
    
    class Meta:
        model = Brand
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for product image model."""
    
    class Meta:
        model = ProductImage
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class ProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for product review model."""
    
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ProductReview
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at', 'updated_at', 'helpful_count')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for product model."""
    
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('id', 'slug', 'created_at', 'updated_at', 'num_reviews', 
                           'rating', 'is_deleted', 'is_new')
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Calculate discount percentage if applicable
        if instance.discount_price and instance.price:
            discount_percent = ((instance.price - instance.discount_price) / instance.price) * 100
            data['discount_percentage'] = round(discount_percent, 2)
        else:
            data['discount_percentage'] = 0
        return data


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list view (lighter version)."""
    
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'price', 'discount_price', 'final_price',
            'discount_percentage', 'stock_quantity', 'is_active', 'is_featured',
            'is_trending', 'rating', 'num_reviews', 'category', 'brand', 'primary_image',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'slug', 'created_at', 'updated_at')
    
    def get_primary_image(self, obj):
        primary_img = obj.images.filter(is_primary=True).first()
        if primary_img:
            return ProductImageSerializer(primary_img).data
        return None


class ProductSearchSerializer(serializers.ModelSerializer):
    """Serializer for product search model."""
    
    class Meta:
        model = ProductSearch
        fields = '__all__'
        read_only_fields = ('id', 'user', 'session_key', 'ip_address', 'timestamp')