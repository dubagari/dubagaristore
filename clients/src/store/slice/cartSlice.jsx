import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./cartThunks";
import { authActions } from "./authSlice";



const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,

  loading: false,
  error: null,
};

const calculateTotals = (state) => {
  state.totalQuantity = state.cartItems.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  state.totalPrice = state.cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );
};


const setCartFromServer = (state, action) => {
  state.cartItems = action.payload.items;
  calculateTotals(state);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        setCartFromServer(state, action);
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD ITEM
      .addCase(addToCart.fulfilled, (state, action) => {
        setCartFromServer(state, action);
      })

      // UPDATE ITEM
      .addCase(updateCartItem.fulfilled, (state, action) => {
  setCartFromServer(state, action);
})

      // REMOVE ITEM
      .addCase(removeFromCart.fulfilled, (state, action) => {
  setCartFromServer(state, action);
})

      // CLEAR CART (API)
     .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
      })

      // CLEAR CART ON LOGOUT (Local memory wipe)
      .addCase(authActions.logout, (state) => {
        state.cartItems = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
        state.error = null;
      })
  },
});

export const selectCartItems = (state) => state.cart.cartItems;

export const selectCartLoading = (state) => state.cart.loading;

export const selectCartError = (state) => state.cart.error;

export const selectCartTotalQuantity = (state) =>
  state.cart.totalQuantity;

export const selectCartTotalPrice = (state) =>
  state.cart.totalPrice;

export default cartSlice.reducer;