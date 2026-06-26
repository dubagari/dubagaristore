import { createAsyncThunk } from "@reduxjs/toolkit";

export const initializePaystackPayment = createAsyncThunk(
  "payment/initialize",
  async (paymentData, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);