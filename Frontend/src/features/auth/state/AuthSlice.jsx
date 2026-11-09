import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticate: false,
  isCheckingAuth: false,
};

const authSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticate = true;
      state.isCheckingAuth = false;
    },

    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticate = false;
      state.isCheckingAuth = false;
    },

    setAuthChecking: (state, action) => {
      state.isCheckingAuth = action.payload;
    },
  },
});

export const {
  setCredentials,
  logOut,
  setAuthChecking,
} = authSlice.actions;

export default authSlice.reducer;