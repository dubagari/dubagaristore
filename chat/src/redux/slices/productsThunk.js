import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/products";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await fetch("http://localhost:5000/api/products");

    const data = await res.json();

    return data.data;
  },
);

// export const createProduct = createAsyncThunk(
//   "products/createProduct",
//   async (newProduct, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth?.user?.token;

//       const formData = new FormData();

//       Object.entries(newProduct).forEach(([key, value]) => {
//         if (key === "image") {
//           value.forEach((file) => {
//             formData.append("images", file);
//           });
//         } else {
//           formData.append(key, value);
//         }
//       });

//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to create product");
//       }

//       return data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   },
// );

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id, thunkAPI) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return id;
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
