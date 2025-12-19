import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, PurchaseHistory } from '@/types/product';

interface AppContextType {
  wishlist: Product[];
  cart: CartItem[];
  purchaseHistory: PurchaseHistory[];
  isAdmin: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  checkout: () => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>(() => {
    const saved = localStorage.getItem('purchaseHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('isAdmin');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
  }, [purchaseHistory]);

  useEffect(() => {
    localStorage.setItem('isAdmin', String(isAdmin));
  }, [isAdmin]);

  const addToWishlist = (product: Product) => {
    if (!wishlist.find(p => p.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(wishlist.filter(p => p.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(p => p.id === productId);
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = () => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newPurchase: PurchaseHistory = {
      id: Date.now().toString(),
      products: [...cart],
      total,
      date: new Date().toISOString(),
    };
    
    setPurchaseHistory([newPurchase, ...purchaseHistory]);
    clearCart();
  };

  const login = (email: string, password: string): boolean => {
    if (email === 'yosinxon@gmail.com' && password === 'holbi2007') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AppContext.Provider value={{
      wishlist,
      cart,
      purchaseHistory,
      isAdmin,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      checkout,
      login,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
