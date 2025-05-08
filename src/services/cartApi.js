import api from "./api";

export const getCart = async (token) => {
  try {
    const response = await api.get("/cart", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addToCart = async (productId, quantity, token) => {
  try {
    const response = await api.post(
      "/cart/add",
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity, token) => {
  try {
    const response = await api.put(
      `/cart/update/${itemId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeCartItem = async (itemId, token) => {
  try {
    const response = await api.delete(`/cart/remove/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export const clearCart = async (token) => {
  try {
    const response = await api.delete("/cart/clear", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

// For guest users (localStorage operations)
export const getGuestCart = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error getting guest cart:", error);
    return [];
  }
};

export const addToGuestCart = (product, quantity) => {
  try {
    const cart = getGuestCart();
    const existingItemIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error("Error adding to guest cart:", error);
    throw error;
  }
};

export const migrateGuestCart = async (token) => {
  try {
    const guestCart = getGuestCart();
    if (guestCart.length === 0) return;

    // Add all items from guest cart to user cart
    for (const item of guestCart) {
      await addToCart(item._id, item.quantity, token);
    }

    // Clear guest cart after migration
    localStorage.removeItem("cart");
  } catch (error) {
    console.error("Error migrating guest cart:", error);
    throw error;
  }
};

// Add getProduct function
export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};