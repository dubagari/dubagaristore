import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: JSON.parse(localStorage.getItem("adminUser")),
    token: localStorage.getItem("token"),
  },

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("adminUser");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
