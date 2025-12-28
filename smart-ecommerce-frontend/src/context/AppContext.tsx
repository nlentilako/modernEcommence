import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';

interface AppState {
  user: User | null;
  cartCount: number;
  wishlistCount: number;
  isAuthenticated: boolean;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CART_COUNT'; payload: number }
  | { type: 'SET_WISHLIST_COUNT'; payload: number }
  | { type: 'SET_AUTH_STATUS'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  cartCount: 0,
  wishlistCount: 0,
  isAuthenticated: false,
  loading: true,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };
    case 'SET_CART_COUNT':
      return {
        ...state,
        cartCount: action.payload,
      };
    case 'SET_WISHLIST_COUNT':
      return {
        ...state,
        wishlistCount: action.payload,
      };
    case 'SET_AUTH_STATUS':
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        loading: false,
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('access_token');
    if (token) {
      // In a real app, you would fetch user data here
      // For now, we'll just set isAuthenticated to true
      dispatch({ type: 'SET_AUTH_STATUS', payload: true });
    } else {
      dispatch({ type: 'SET_AUTH_STATUS', payload: false });
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};