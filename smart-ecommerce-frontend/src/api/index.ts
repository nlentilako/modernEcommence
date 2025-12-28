import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login/', { email, password }),
  
  register: (email: string, password: string, first_name: string, last_name: string) => 
    api.post('/auth/register/', { email, password, first_name, last_name }),
  
  logout: () => 
    api.post('/auth/logout/'),
  
  getCurrentUser: () => 
    api.get('/auth/user/'),
  
  refreshToken: (refresh: string) => 
    axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh }),
};

// Product API
export const productAPI = {
  getProducts: (filters?: any) => 
    api.get('/products/', filters ? { params: filters } : {}),
  
  getProduct: (id: number) => 
    api.get(`/products/${id}/`),
  
  getCategories: () => 
    api.get('/categories/'),
  
  getCategory: (id: number) => 
    api.get(`/categories/${id}/`),
  
  getFeaturedProducts: () => 
    api.get('/products/featured/'),
  
  getTrendingProducts: () => 
    api.get('/products/trending/'),
  
  getFlashDeals: () => 
    api.get('/products/flash-deals/'),
  
  getRelatedProducts: (productId: number) => 
    api.get(`/products/${productId}/related/`),
};

// Cart API
export const cartAPI = {
  getCart: () => 
    api.get('/cart/'),
  
  addToCart: (productId: number, quantity: number) => 
    api.post('/cart/add/', { product_id: productId, quantity }),
  
  updateCartItem: (itemId: number, quantity: number) => 
    api.put(`/cart/items/${itemId}/`, { quantity }),
  
  removeFromCart: (itemId: number) => 
    api.delete(`/cart/items/${itemId}/`),
  
  clearCart: () => 
    api.delete('/cart/clear/'),
};

// Order API
export const orderAPI = {
  getOrders: () => 
    api.get('/orders/'),
  
  getOrder: (id: number) => 
    api.get(`/orders/${id}/`),
  
  createOrder: (data: any) => 
    api.post('/orders/', data),
  
  updateOrder: (id: number, data: any) => 
    api.put(`/orders/${id}/`, data),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => 
    api.get('/wishlist/'),
  
  addToWishlist: (productId: number) => 
    api.post('/wishlist/add/', { product_id: productId }),
  
  removeFromWishlist: (productId: number) => 
    api.delete(`/wishlist/remove/${productId}/`),
  
  isInWishlist: (productId: number) => 
    api.get(`/wishlist/check/${productId}/`),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => 
    api.get('/admin/dashboard/stats/'),
  
  getSalesData: (startDate: string, endDate: string) => 
    api.get('/admin/dashboard/sales/', { params: { start_date: startDate, end_date: endDate } }),
  
  getProductPerformance: () => 
    api.get('/admin/dashboard/product-performance/'),
  
  getUserGrowth: (startDate: string, endDate: string) => 
    api.get('/admin/dashboard/user-growth/', { params: { start_date: startDate, end_date: endDate } }),
  
  getPaymentBreakdown: () => 
    api.get('/admin/dashboard/payment-breakdown/'),
};

export default api;