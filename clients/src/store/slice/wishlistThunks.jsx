import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";



const getToken = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo?.token || null;
};

// GET WISHLIST
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    const token = getToken();

    if (!token) {
      return rejectWithValue("Please log in");
    }

    try {
      const response = await fetch(`${BASE_URL}/api/wishlist`, {
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
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to add to wishlist");
        return rejectWithValue(data.message);
      }

      toast.success("Added to Wishlist!");
      return data;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// REMOVE ITEM
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to remove from wishlist");
        return rejectWithValue(data.message);
      }

      toast.success("Removed from Wishlist");
      return data;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// CLEAR WISHLIST
export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/wishlist`, {
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
