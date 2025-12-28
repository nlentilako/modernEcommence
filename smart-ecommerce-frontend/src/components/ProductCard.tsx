import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Percent } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // In a real app, you would call the API to add/remove from wishlist
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="object-contain w-full h-full"
            />
          </div>
        </Link>
        
        {product.discount_percentage && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount_percentage}%
          </div>
        )}
        
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          } shadow-sm`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
        
        <button className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white p-2 rounded-full shadow-sm hover:bg-primary-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-gray-900 line-clamp-1">
            <Link to={`/products/${product.id}`} className="hover:text-primary-600">
              {product.name}
            </Link>
          </h3>
        </div>
        
        <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.category_name}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.num_reviews})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900">
              ${product.discount_price ? product.discount_price : product.price}
            </span>
            {product.discount_price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              Only {product.stock} left!
            </span>
          )}
        </div>
        
        {product.stock === 0 && (
          <div className="mt-2 text-center">
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          </div>
        )}
      </div>
    </div>
  );
};