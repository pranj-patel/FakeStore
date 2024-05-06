// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },
    removeItemFromCart(state, action) {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
    },
    updateCartItemQuantity(state, action) {
      const { itemId, newQuantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.id === itemId);
      if (itemToUpdate) {
        itemToUpdate.quantity = newQuantity;
      }
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateCartItemQuantity } = cartSlice.actions;

export default cartSlice.reducer;
