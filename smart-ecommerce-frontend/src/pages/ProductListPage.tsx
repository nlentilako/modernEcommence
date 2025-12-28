import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

// Mock data
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
  {
    id: 7,
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
    id: 8,
    name: 'Running Shoes',
    description: 'Lightweight running shoes for optimal comfort',
    price: 89.99,
    discount_price: 69.99,
    category: 5,
    category_name: 'Sports',
    image: 'https://via.placeholder.com/300x300',
    rating: 4.4,
    num_reviews: 67,
    stock: 0,
    is_available: false,
    is_featured: false,
    is_trending: false,
    created_at: '2023-08-15T13:20:00Z',
    updated_at: '2023-11-10T14:30:00Z',
    discount_percentage: 22,
  },
];

const categories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Fashion' },
  { id: 3, name: 'Home & Garden' },
  { id: 4, name: 'Beauty' },
  { id: 5, name: 'Sports' },
  { id: 6, name: 'Books' },
];

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch products based on filters
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredProducts = [...mockProducts];
      
      // Apply category filter
      const category = searchParams.get('category');
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === parseInt(category));
        setSelectedCategory(category);
      }
      
      // Apply price filter
      filteredProducts = filteredProducts.filter(p => 
        p.price >= priceRange[0] && p.price <= priceRange[1]
      );
      
      // Apply rating filter
      if (ratingFilter) {
        filteredProducts = filteredProducts.filter(p => p.rating >= ratingFilter);
      }
      
      // Apply sorting
      filteredProducts.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
          default:
            return a.name.localeCompare(b.name);
        }
      });
      
      setProducts(filteredProducts);
      setLoading(false);
    }, 500);
  }, [searchParams, priceRange, ratingFilter, sortBy]);

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      searchParams.delete('category');
      setSelectedCategory(null);
    } else {
      searchParams.set('category', categoryId);
      setSelectedCategory(categoryId);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    searchParams.delete('category');
    setSelectedCategory(null);
    setPriceRange([0, 500]);
    setRatingFilter(null);
    setSortBy('name');
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Filters Sidebar - Hidden on mobile by default */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 lg:w-72 pr-0 md:pr-8 mb-6 md:mb-0`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Clear All
                </button>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={selectedCategory === category.id.toString()}
                        onChange={() => handleCategoryChange(category.id.toString())}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label 
                        htmlFor={`category-${category.id}`} 
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="radio"
                        id={`rating-${rating}`}
                        name="rating"
                        checked={ratingFilter === rating}
                        onChange={() => setRatingFilter(rating)}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <label 
                        htmlFor={`rating-${rating}`} 
                        className="ml-2 text-sm text-gray-700 flex items-center"
                      >
                        {rating}+ stars
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Availability */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in-stock"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="in-stock" className="ml-2 text-sm text-gray-700">
                    In Stock
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                {selectedCategory 
                  ? `${categories.find(c => c.id.toString() === selectedCategory)?.name} Products` 
                  : 'All Products'}
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {products.length} product{products.length !== 1 ? 's' : ''} found
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="name">Sort by: Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Filters
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={handleClearFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && products.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 bg-primary-600 text-white text-sm font-medium">
                    1
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};