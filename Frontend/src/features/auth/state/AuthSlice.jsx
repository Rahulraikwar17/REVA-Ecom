import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "currentUser",
  initialState: {
    user: null,
    token: null,
    isAuthenticate: false,
  },
  reducers: {
    setCredentials(state, action) {
      ((state.user = action.payload.user),
        (state.token = action.payload.accessToken),
        (state.isAuthenticate = true));
    },
    logOut(state, action) {
      ((state.user = null),
        (state.token = null),
        (state.isAuthenticate = false));
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
