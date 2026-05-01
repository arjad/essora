import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('essora_cart');
    if (!savedCart) return [];
    
    try {
      const parsed = JSON.parse(savedCart);
      // Clean up legacy numeric IDs (1, 2, 3) from development
      const filtered = parsed.filter(item => typeof item.id === 'string' && item.id.length > 5);
      if (filtered.length !== parsed.length) {
        localStorage.setItem('essora_cart', JSON.stringify(filtered));
        return filtered;
      }
      return parsed;
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('essora_cart', JSON.stringify(cartItems));

    // Abandoned Cart Tracking (sync incomplete order to backend)
    const syncIncomplete = async () => {
      const token = localStorage.getItem('token');
      if (!token || cartItems.length === 0) return;

      try {
        const meRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const meData = await meRes.json();
        
        if (meData.success) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/orders/sync-incomplete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              user: meData.data._id,
              items: cartItems.map(item => ({
                product: item.id,
                name: item.name,
                quantity: item.quantity,
                price: parseInt(item.price.replace(/[^0-9]/g, ''))
              })),
              totalAmount: cartTotal
            })
          });
          console.log('[Cart] Synced incomplete order to backend');
        }
      } catch (err) {
        console.error('[Cart] Sync incomplete error:', err);
      }
    };

    const timer = setTimeout(syncIncomplete, 2000); // 2s debounce
    return () => clearTimeout(timer);
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    // Extract numbers from price string (e.g., "Rs. 18,500" -> 18500)
    const price = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
