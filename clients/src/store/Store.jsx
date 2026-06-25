import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice";
import authSlice from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authSlice,
    cart: cartReducer,
  },
});

export default store;
