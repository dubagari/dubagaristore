import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch users",
        );
      }

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Login user
export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Logout user
export const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  localStorage.removeItem("token");
  return null;
});
