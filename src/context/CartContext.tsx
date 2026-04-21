'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { bookId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload };

    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.bookId === action.payload.bookId);
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map(i =>
            i.bookId === action.payload.bookId
              ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
              : i
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.bookId !== action.payload) };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.bookId !== action.payload.bookId) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.bookId === action.payload.bookId
            ? { ...i, quantity: Math.min(action.payload.quantity, i.stock) }
            : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bookstore-cart');
      if (saved) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('bookstore-cart', JSON.stringify(state.items));
  }, [state.items]);

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (bookId) => dispatch({ type: 'REMOVE_ITEM', payload: bookId }),
    updateQuantity: (bookId, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { bookId, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    itemCount: state.items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
