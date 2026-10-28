import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { adaptApiProduct } from '../services/productService';

const ShopContext = createContext(null);

const CART_STORAGE_KEY = 'es_ethnic_styles_cart';
const WISHLIST_STORAGE_KEY = 'es_ethnic_styles_wishlist';

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/products?page=1&page_size=100', {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        const apiProducts = data.items.map(adaptApiProduct).filter(Boolean);
        // Merge apiProducts with static PRODUCTS so updated price & primary_image always reflect
        const merged = PRODUCTS.map((staticProd) => {
          const apiMatch = apiProducts.find(
            (ap) =>
              ap.sku === staticProd.sku ||
              ap.slug === staticProd.slug ||
              ap.name.toLowerCase() === staticProd.name.toLowerCase()
          );
          return apiMatch ? { ...staticProd, ...apiMatch } : staticProd;
        });
        // Also include any newly created products added via Admin that are not in PRODUCTS
        const newApiOnly = apiProducts.filter(
          (ap) =>
            !PRODUCTS.some(
              (sp) => sp.sku === ap.sku || sp.slug === ap.slug || sp.name.toLowerCase() === ap.name.toLowerCase()
            )
        );
        setProducts([...merged, ...newApiOnly]);
      }
    } catch {
      // Offline fallback: keep static PRODUCTS
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);
  // Cart state initialization with local storage recovery
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state initialization with local storage recovery
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage error saving cart:', e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage error saving wishlist:', e);
    }
  }, [wishlist]);

  // Toast notification helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Add item to cart with size validation
  const addToCart = (product, size, color, quantity = 1) => {
    if (!product) return { success: false, error: 'Product is invalid' };

    // Validate size selection
    if (!size || size.trim() === '') {
      showToast('Please select a size to proceed');
      return { success: false, error: 'Please select a size' };
    }

    const selectedColor = color || (product.colors && product.colors[0]) || { name: 'Default', hex: '#4A171C' };
    const cartItemId = `${product.id}-${size}-${selectedColor.name}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          product,
          size,
          color: selectedColor,
          quantity,
        },
      ];
    });

    showToast(`Added "${product.name}" to your shopping bag`);
    setIsCartOpen(true);
    return { success: true };
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Update item quantity (+1 / -1)
  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Toggle item in wishlist
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist');
        return prev.filter((id) => id !== productId);
      }
      showToast('Saved to your wishlist');
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Derived counts and totals
  const cartCount = cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  const cartSubtotal = cart.reduce((total, item) => {
    const rawPrice = item.price ?? item.product?.price ?? 0;
    const numPrice = Number(rawPrice) || 0;
    const qty = Number(item.quantity) || 1;
    return total + (numPrice * qty);
  }, 0);
  const wishlistCount = wishlist.length;

  // INR currency formatter
  const formatPrice = (amount) => {
    const num = Number(amount);
    if (amount == null || isNaN(num)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const value = {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    wishlist,
    wishlistCount,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    toastMessage,
    showToast,
    products,
    refreshProducts,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
