import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, loginUser, logoutUser } from "./userThunk.js";

const initialState = {
  users: [],
  userInfo: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export const selectUsers = (state) => state.user?.users ?? [];
export const selectUser = (state) => state.user?.userInfo;
export const selectUserLoading = (state) => state.user?.loading ?? false;
export const selectUserError = (state) => state.user?.error;

export default userSlice.reducer;
