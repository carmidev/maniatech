"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Candy } from '@/app/mock-data';

interface CartItem extends Candy {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (candy: Candy) => void;
  removeFromCart: (candyId: string) => void;
  updateQuantity: (candyId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // LocalStorage persistence
  useEffect(() => {
    const savedCart = localStorage.getItem('dolce_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dolce_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (candy: Candy) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === candy.id);
      if (existing) {
        return prev.map(item => 
          item.id === candy.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...candy, quantity: 1 }];
    });
  };

  const removeFromCart = (candyId: string) => {
    setItems(prev => prev.filter(item => item.id !== candyId));
  };

  const updateQuantity = (candyId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(candyId);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === candyId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
