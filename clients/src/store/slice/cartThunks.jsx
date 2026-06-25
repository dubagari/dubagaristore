import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = `${import.meta.env.VITE_API_URL}/api/cart`;

const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo?.token || null;
};
// ✅ Fix: removed module-level `const token = getToken()` — it captured the token
// at import time (before login), making all cart operations fail for fresh logins.
// Each thunk already calls getToken() fresh, so this was both stale and unused.


// GET CART
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    const token = getToken();

    if (!token) {
      return rejectWithValue("Please log in");
    }

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ADD ITEM
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          productId: item.id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE QUANTITY
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// REMOVE ITEM
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

  return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// CLEAR CART
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.message);
      }

      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);