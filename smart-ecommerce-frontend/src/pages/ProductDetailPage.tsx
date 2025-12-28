import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Share2, Shield, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

// Mock data
const mockProduct: Product = {
  id: 1,
  name: 'Wireless Bluetooth Headphones',
  description: 'High-quality wireless headphones with noise cancellation. Experience crystal-clear audio with our premium sound technology. These headphones feature 30-hour battery life, comfortable over-ear design, and built-in microphone for calls.',
  price: 129.99,
  discount_price: 99.99,
  category: 1,
  category_name: 'Electronics',
  image: 'https://via.placeholder.com/500x500',
  images: [
    'https://via.placeholder.com/500x500',
    'https://via.placeholder.com/500x500',
    'https://via.placeholder.com/500x500',
    'https://via.placeholder.com/500x500',
  ],
  rating: 4.5,
  num_reviews: 128,
  stock: 50,
  is_available: true,
  is_featured: true,
  is_trending: true,
  created_at: '2023-01-15T10:30:00Z',
  updated_at: '2023-11-20T14:22:00Z',
  discount_percentage: 23,
};

const relatedProducts: Product[] = [
  {
    id: 2,
    name: 'Smart Watch Series 5',
    description: 'Feature-rich smartwatch with health monitoring',
    price: 249.99,
    discount_price: 199.99,
    category: 1,
    category_name: 'Electronics',
    image: 'https://via.placeholder.com/300x300',
    rating: 4.7,
    num_reviews: 89,
    stock: 30,
    is_available: true,
    is_featured: true,
    is_trending: false,
    created_at: '2023-02-20T09:15:00Z',
    updated_at: '2023-11-18T11:45:00Z',
    discount_percentage: 20,
  },
  {
    id: 3,
    name: 'Fitness Tracker',
    description: 'Track your steps, heart rate, and sleep patterns',
    price: 79.99,
    discount_price: 59.99,
    category: 1,
    category_name: 'Electronics',
    image: 'https://via.placeholder.com/300x300',
    rating: 4.3,
    num_reviews: 95,
    stock: 40,
    is_available: true,
    is_featured: false,
    is_trending: true,
    created_at: '2023-05-12T11:30:00Z',
    updated_at: '2023-11-21T13:15:00Z',
    discount_percentage: 25,
  },
  {
    id: 4,
    name: 'Wireless Gaming Mouse',
    description: 'High-precision gaming mouse with RGB lighting',
    price: 49.99,
    category: 1,
    category_name: 'Electronics',
    image: 'https://via.placeholder.com/300x300',
    rating: 4.8,
    num_reviews: 112,
    stock: 15,
    is_available: true,
    is_featured: false,
    is_trending: true,
    created_at: '2023-07-22T10:05:00Z',
    updated_at: '2023-11-15T09:45:00Z',
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    description: 'Portable speaker with 360° sound',
    price: 89.99,
    discount_price: 69.99,
    category: 1,
    category_name: 'Electronics',
    image: 'https://via.placeholder.com/300x300',
    rating: 4.4,
    num_reviews: 76,
    stock: 25,
    is_available: true,
    is_featured: false,
    is_trending: false,
    created_at: '2023-09-10T16:30:00Z',
    updated_at: '2023-11-12T11:20:00Z',
    discount_percentage: 22,
  },
];

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  useEffect(() => {
    // In a real app, you would fetch product data based on ID
    setProduct(mockProduct);
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // In a real app, you would call the API to add/remove from wishlist
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          <span className="mx-2">/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary-600">{product.category_name}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg p-4 mb-4">
              <img 
                src={product.images?.[selectedImage] || product.image} 
                alt={product.name} 
                className="w-full h-auto object-contain max-h-96"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-24 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <button 
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-full ${
                    isWishlisted 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.num_reviews} reviews)
                </span>
              </div>

              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.discount_price ? product.discount_price : product.price}
                </span>
                {product.discount_price && (
                  <span className="ml-3 text-xl text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
                {product.discount_percentage && (
                  <span className="ml-3 bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {product.discount_percentage}% OFF
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="flex items-center mb-6">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.is_available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.is_available ? 'In Stock' : 'Out of Stock'}
                </div>
                {product.is_available && product.stock <= 5 && (
                  <span className="ml-3 text-sm text-red-600">
                    Only {product.stock} left!
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="mr-4 text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product.stock || 1)}
                    className="p-2 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  Buy Now
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex items-center text-gray-600 hover:text-primary-600">
                  <Share2 className="h-5 w-5 mr-1" />
                  <span>Share</span>
                </button>
              </div>

              {/* Product Features */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Truck className="h-6 w-6 text-primary-600 mr-2" />
                    <div>
                      <p className="font-medium">Free Shipping</p>
                      <p className="text-sm text-gray-600">Orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-6 w-6 text-primary-600 mr-2" />
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-sm text-gray-600">100% Secure</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <RotateCcw className="h-6 w-6 text-primary-600 mr-2" />
                    <div>
                      <p className="font-medium">30 Days Return</p>
                      <p className="text-sm text-gray-600">Free Exchange</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews ({product.num_reviews})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'shipping'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Shipping & Returns
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                <p className="text-gray-700 mb-4">
                  {product.description} This premium product is designed with attention to detail and built to last. 
                  The high-quality materials ensure durability while the sleek design adds a touch of elegance to your lifestyle.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>High-quality materials for durability</li>
                  <li>Ergonomic design for comfort</li>
                  <li>Easy to use and maintain</li>
                  <li>Compatible with most devices</li>
                  <li>Comes with a 2-year warranty</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, j) => (
                            <Star 
                              key={j} 
                              className={`h-4 w-4 ${
                                j < 4 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 font-medium">John D. - October 15, 2023</span>
                      </div>
                      <p className="text-gray-700">
                        This product exceeded my expectations. The quality is excellent and it works perfectly. 
                        I would definitely recommend this to others.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping & Returns</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Shipping</h4>
                    <p className="text-gray-700 mt-1">
                      Free shipping on orders over $50. For orders under $50, shipping costs $5.99. 
                      Delivery takes 3-5 business days.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Returns</h4>
                    <p className="text-gray-700 mt-1">
                      We offer a 30-day return policy. If you're not satisfied with your purchase, 
                      you can return it for a full refund or exchange.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Warranty</h4>
                    <p className="text-gray-700 mt-1">
                      This product comes with a 2-year manufacturer warranty. Contact us if you experience any issues.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};