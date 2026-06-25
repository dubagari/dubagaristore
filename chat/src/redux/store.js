import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./slices/navigationSlice.js";
import userReducer from "./slices/userSlice.js";
import ordersReducer from "./slices/ordersSlice.js";
import productsReducer from "./slices/productsSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    orders: ordersReducer,
    navigation: navigationReducer,
    products: productsReducer,
  },
});
