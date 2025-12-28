// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  is_admin: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category: number;
  category_name?: string;
  image: string;
  images?: string[];
  rating: number;
  num_reviews: number;
  stock: number;
  is_available: boolean;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
  discount_percentage?: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_category?: number | null;
  is_active: boolean;
}

// Cart types
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  total_price: number;
}

export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total_items: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

// Order types
export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  total_price: number;
}

export interface Order {
  id: number;
  user: number;
  order_items: OrderItem[];
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  shipping_address: string;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
}

// Wishlist types
export interface WishlistItem {
  id: number;
  user: number;
  product: Product;
  added_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Filter types
export interface ProductFilters {
  category?: number;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  in_stock?: boolean;
  on_sale?: boolean;
  sort_by?: 'name' | 'price' | 'rating' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// Admin dashboard types
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductPerformance {
  product: Product;
  sales_count: number;
  revenue: number;
}

export interface UserGrowthData {
  date: string;
  new_users: number;
}

export interface PaymentMethodBreakdown {
  method: string;
  count: number;
  percentage: number;
}