import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Percent, Clock, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

// Mock data - in a real app, these would come from API calls
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 129.99,
    discount_price: 99.99,
    category: 1,
    category_name: 'Electronics',
    image: 'https://via.placeholder.com/300x300',
    rating: 4.5,
    num_reviews: 128,
    stock: 50,
    is_available: true,
    is_featured: true,
    is_trending: true,
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-11-20T14:22:00Z',
    discount_percentage: 23,
  },
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
    name: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt for everyday wear',
    price: 24.99,
    category: 2,
    category_name: 'Fashion',
    image: 'https://via.placeholder.com/300x300',
    rating: 4.2,
    num_reviews: 56,
    stock: 100,
    is_available: true,
    is_featured: false,
    is_trending: true,
    created_at: '2023-03-10T16:45:00Z',
    updated_at: '2023-11-22T08:30:00Z',
  },
  {
    id: 4,
    name: 'Home Coffee Maker',
    description: 'Automatic coffee maker with programmable features',
    price: 89.99,
    category: 3,
    category_name: 'Home & Garden',
    image: 'https://via.placeholder.com/300x300',
    rating: 4.4,
    num_reviews: 72,
    stock: 25,
    is_available: true,
    is_featured: true,
    is_trending: false,
    created_at: '2023-04-05T12:20:00Z',
    updated_at: '2023-11-19T15:10:00Z',
  },
  {
    id: 5,
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
    id: 6,
    name: 'Designer Sunglasses',
    description: 'Stylish sunglasses with UV protection',
    price: 59.99,
    category: 2,
    category_name: 'Fashion',
    image: 'https://via.placeholder.com/300x300',
    rating: 4.6,
    num_reviews: 43,
    stock: 20,
    is_available: true,
    is_featured: true,
    is_trending: false,
    created_at: '2023-06-18T14:45:00Z',
    updated_at: '2023-11-20T10:20:00Z',
  },
];

const mockCategories = [
  { id: 1, name: 'Electronics', image: 'https://via.placeholder.com/200x200', count: 120 },
  { id: 2, name: 'Fashion', image: 'https://via.placeholder.com/200x200', count: 85 },
  { id: 3, name: 'Home & Garden', image: 'https://via.placeholder.com/200x200', count: 65 },
  { id: 4, name: 'Beauty', image: 'https://via.placeholder.com/200x200', count: 45 },
  { id: 5, name: 'Sports', image: 'https://via.placeholder.com/200x200', count: 55 },
  { id: 6, name: 'Books', image: 'https://via.placeholder.com/200x200', count: 30 },
];

const flashDeals = [
  { id: 1, name: 'Gaming Mouse', original_price: 49.99, discount_price: 29.99, discount_percentage: 40, time_left: '2:45:12' },
  { id: 2, name: 'External SSD', original_price: 129.99, discount_price: 89.99, discount_percentage: 31, time_left: '5:22:33' },
  { id: 3, name: 'Wireless Keyboard', original_price: 39.99, discount_price: 24.99, discount_percentage: 38, time_left: '1:15:47' },
  { id: 4, name: 'Bluetooth Speaker', original_price: 79.99, discount_price: 49.99, discount_percentage: 38, time_left: '8:30:05' },
];

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [flashDeals, setFlashDeals] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, you would fetch data from API
    setFeaturedProducts(mockProducts.filter(p => p.is_featured));
    setTrendingProducts(mockProducts.filter(p => p.is_trending));
    setFlashDeals(flashDeals);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Summer Sale is Live!</h1>
            <p className="text-xl mb-8">Up to 50% off on selected items. Limited time offer.</p>
            <Link 
              to="/products" 
              className="inline-block bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/products" className="text-primary-600 hover:underline font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mockCategories.map((category) => (
              <Link 
                key={category.id}
                to={`/products?category=${category.id}`}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-600">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-primary-600 hover:underline font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Flash Deals</h2>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">Time left: 02:45:12</span>
              <Link to="/products" className="text-primary-600 hover:underline font-medium">
                View All
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashDeals.map((deal) => (
              <div key={deal.id} className="border rounded-lg p-4 bg-red-50">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="bg-gray-300 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{deal.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-lg font-bold text-red-600">${deal.discount_price}</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">${deal.original_price}</span>
                  <span className="ml-2 text-sm font-medium text-red-600">-{deal.discount_percentage}%</span>
                </div>
                <div className="text-xs text-gray-600 mb-3">Time left: {deal.time_left}</div>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Trending Products</h2>
            </div>
            <Link to="/products" className="text-primary-600 hover:underline font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-600 to-secondary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and new product alerts
          </p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-r-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};