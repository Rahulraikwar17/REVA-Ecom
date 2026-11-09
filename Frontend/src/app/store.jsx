import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/AuthSlice";
import cartReducer from "../features/cart/state/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});