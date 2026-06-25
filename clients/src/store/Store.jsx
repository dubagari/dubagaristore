import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice";
import authSlice from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";
import wishlistReducer from "./slice/wishlistSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authSlice,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
