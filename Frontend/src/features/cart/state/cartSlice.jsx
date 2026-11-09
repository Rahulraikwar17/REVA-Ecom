import { createSlice } from "@reduxjs/toolkit";

const getInitialItems = () => {
  try {
    const savedItems = localStorage.getItem("guestCart");
    return savedItems ? JSON.parse(savedItems) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: getInitialItems(),
};

const saveCart = (items) => {
  localStorage.setItem("guestCart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addGuestCartItem: (state, action) => {
      const { product, size, quantity = 1, availableStock } = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.product._id === product._id && item.size === size
      );

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + quantity,
          availableStock ?? Infinity
        );
      } else {
        state.items.push({
          _id: `${product._id}-${size}`,
          product,
          size,
          quantity,
          availableStock,
        });
      }

      saveCart(state.items);
    },

    updateGuestCartItem: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((item) => item._id === itemId);

      if (item && quantity >= 1) {
        item.quantity = Math.min(
          quantity,
          item.availableStock ?? Infinity
        );
      }

      saveCart(state.items);
    },

    removeGuestCartItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );

      saveCart(state.items);
    },

    clearGuestCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },

    removeSyncedGuestItems: (state, action) => {
      const syncedIds = new Set(action.payload);

      state.items = state.items.filter(
        (item) => !syncedIds.has(item._id)
      );

      saveCart(state.items);
    },
  },
});

export const {
  addGuestCartItem,
  updateGuestCartItem,
  removeGuestCartItem,
  clearGuestCart,
  removeSyncedGuestItems,
} = cartSlice.actions;

export default cartSlice.reducer;