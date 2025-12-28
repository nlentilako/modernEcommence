import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { authAPI } from '../api';
import { ProductCategory } from '../types';

export const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  // Mock categories - in a real app, these would come from an API
  useEffect(() => {
    // In a real app, you would fetch categories like this:
    // productAPI.getCategories().then(response => setCategories(response.data.results));
    // For now, using mock data
    setCategories([
      { id: 1, name: 'Electronics', slug: 'electronics', is_active: true },
      { id: 2, name: 'Fashion', slug: 'fashion', is_active: true },
      { id: 3, name: 'Home & Garden', slug: 'home-garden', is_active: true },
      { id: 4, name: 'Beauty', slug: 'beauty', is_active: true },
      { id: 5, name: 'Sports', slug: 'sports', is_active: true },
      { id: 6, name: 'Books', slug: 'books', is_active: true },
    ]);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Free shipping on orders above $50</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/help" className="hover:underline">Help & Support</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              <span className="text-primary-600">Smart</span>
              <span className="text-secondary-600">Shop</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pl-10 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 bg-primary-600 text-white p-1.5 rounded-md hover:bg-primary-700"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
              
              {/* Search suggestions dropdown */}
              {isSearchFocused && searchQuery && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2 text-sm text-gray-500">Search suggestions</div>
                  {/* In a real app, you would show search suggestions here */}
                </div>
              )}
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-primary-600">
              <Heart className="h-6 w-6" />
              {state.wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.wishlistCount}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600">
              <ShoppingCart className="h-6 w-6" />
              {state.cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.cartCount}
                </span>
              )}
            </Link>
            
            {/* User menu */}
            {state.user ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{state.user.first_name}</span>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border">
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  {state.user.is_admin && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-700" />
                <span className="hidden md:inline text-sm font-medium">Account</span>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Category Menu */}
        <div className="hidden md:flex items-center mt-4 space-x-6 overflow-x-auto pb-2">
          <div className="flex space-x-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/products?category=${category.id}`}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
            <Link 
              to="/products" 
              className="text-sm font-medium text-gray-700 hover:text-primary-600 whitespace-nowrap"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bg-primary-600 text-white p-1.5 rounded-md hover:bg-primary-700"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>
            
            <nav className="space-y-2">
              <Link 
                to="/" 
                className="block py-2 text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {state.user && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                </>
              )}
              
              {!state.user && (
                <>
                  <Link 
                    to="/login" 
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
              
              {state.user?.is_admin && (
                <Link 
                  to="/admin" 
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              {state.user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              )}
            </nav>
            
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link 
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="block py-1 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link 
                  to="/products" 
                  className="block py-1 text-gray-700 hover:text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View All Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};