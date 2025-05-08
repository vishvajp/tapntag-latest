// In your CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as cartApi from '../services/cartApi';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      if (user && token) {
        const apiCart = await cartApi.getCart(token);
        setCart(apiCart.items || []);
      } else {
        const guestCart = cartApi.getGuestCart();
        setCart(guestCart);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity, product = null) => {
    try {
      if (user && token) {
        await cartApi.addToCart(productId, quantity, token);
      } else {
        // For guest users, use the product data if provided, otherwise fetch it
        if (product) {
          cartApi.addToGuestCart(product, quantity);
        } else {
          const fetchedProduct = await cartApi.getProduct(productId);
          cartApi.addToGuestCart(fetchedProduct, quantity);
        }
      }
      await fetchCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (user && token) {
        await cartApi.updateCartItem(productId, quantity, token);
      } else {
        const guestCart = cartApi.getGuestCart();
        const updatedCart = guestCart.map(item => 
          item._id === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      await fetchCart();
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user && token) {
        await cartApi.removeCartItem(productId, token);
      } else {
        const guestCart = cartApi.getGuestCart();
        const updatedCart = guestCart.filter(item => item._id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (user && token) {
        await cartApi.clearCart(token);
      } else {
        localStorage.removeItem('cart');
      }
      setCart([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  };

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    fetchCart();
  }, [user, token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItems,
        totalPrice,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);   