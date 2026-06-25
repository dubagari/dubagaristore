import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "./wishlistThunks";
import { authActions } from "./authSlice";

const initialState = {
  wishlistItems: [],
  loading: false,
  error: null,
};

const setWishlistFromServer = (state, action) => {
  state.wishlistItems = action.payload.items || [];
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH WISHLIST
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        setWishlistFromServer(state, action);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD ITEM
      .addCase(addToWishlist.fulfilled, (state, action) => {
        setWishlistFromServer(state, action);
      })

      // REMOVE ITEM
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        setWishlistFromServer(state, action);
      })

      // CLEAR WISHLIST (API)
      .addCase(clearWishlist.fulfilled, (state) => {
        state.wishlistItems = [];
      })

      // CLEAR WISHLIST ON LOGOUT (Local memory wipe)
      .addCase(authActions.logout, (state) => {
        state.wishlistItems = [];
        state.error = null;
      });
  },
});

export const selectWishlistItems = (state) => state.wishlist.wishlistItems;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
