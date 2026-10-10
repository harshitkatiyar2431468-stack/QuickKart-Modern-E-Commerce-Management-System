import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";
import { useToast } from "./ToastContext";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const { showToast } = useToast();
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Sync token changes
  const saveAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      localStorage.setItem("token", newToken);
      if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCart(null);
      setWishlist([]);
    }
  };

  const logout = () => {
    saveAuth("", null);
    showToast("Logged out successfully", "info");
  };

  // Fetch Cart
  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }
    try {
      setLoadingCart(true);
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoadingCart(false);
    }
  }, [token]);

  // Fetch Wishlist
  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }
    try {
      setLoadingWishlist(true);
      const res = await api.get("/wishlist");
      setWishlist(res.data.products || []);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    } finally {
      setLoadingWishlist(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCart();
      fetchWishlist();
    }
  }, [token, fetchCart, fetchWishlist]);

  // Add To Cart
  const addToCart = async (productId, quantity = 1, showFeedback = true) => {
    if (!token) {
      showToast("Please login to add items to cart", "error");
      return false;
    }

    try {
      await api.post("/cart/add", { productId, quantity });
      await fetchCart();
      if (showFeedback) {
        showToast("Item added to cart! 🛍️", "cart");
      }
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add to cart";
      showToast(msg, "error");
      return false;
    }
  };

  // Update Cart Quantity
  const updateQuantity = async (productId, quantity) => {
    if (!token) return;
    try {
      await api.put("/cart/update", { productId, quantity });
      await fetchCart();
    } catch (err) {
      console.error("Update quantity error:", err);
      showToast("Could not update item quantity", "error");
    }
  };

  // Remove From Cart
  const removeFromCart = async (productId) => {
    if (!token) return;
    if (!productId) {
      // If broken item with undefined productId, fetch fresh cart to trigger auto cleanup
      await fetchCart();
      showToast("Cart updated", "info");
      return;
    }
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      if (res.data) {
        setCart(res.data);
      } else {
        await fetchCart();
      }
      showToast("Item removed from cart", "info");
    } catch (err) {
      console.error("Remove from cart error:", err);
      // Fallback reload
      await fetchCart();
      showToast("Item removed from cart", "info");
    }
  };

  // Toggle Wishlist
  const toggleWishlist = async (productId) => {
    if (!token) {
      showToast("Please login to save items to wishlist", "error");
      return false;
    }

    const isExist = wishlist.some(
      (p) => (p._id || p) === productId || (p._id && p._id === productId)
    );

    try {
      if (isExist) {
        await api.delete(`/wishlist/remove/${productId}`);
        setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
        showToast("Removed from Wishlist", "info");
      } else {
        await api.post("/wishlist/add", { productId });
        await fetchWishlist();
        showToast("Added to Wishlist! ❤️", "success");
      }
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Wishlist action failed";
      showToast(msg, "error");
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(
      (p) => (p._id || p) === productId || (p._id && p._id === productId)
    );
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  const wishlistCount = wishlist.length || 0;

  return (
    <ShopContext.Provider
      value={{
        token,
        user,
        saveAuth,
        logout,
        cart,
        cartCount,
        loadingCart,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        wishlist,
        wishlistCount,
        loadingWishlist,
        fetchWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
