// cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    itemCount: 0, // Add itemCount to track the total number of items
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === newItem.id);
      if (existingItemIndex !== -1) {
        // If the item already exists in the cart, update its quantity
        state.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        // If the item is not in the cart, add it
        state.items.push(newItem);
      }
      state.itemCount += newItem.quantity; // Increment itemCount by newItem quantity
    },
    removeItemFromCart(state, action) {
      const itemId = action.payload;
      const removedItem = state.items.find(item => item.id === itemId);
      if (removedItem) {
        state.itemCount -= removedItem.quantity; // Decrement itemCount by removed item's quantity
        state.items = state.items.filter(item => item.id !== itemId);
      }
    },
    updateCartItemQuantity(state, action) {
      const { itemId, newQuantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.id === itemId);
      if (itemToUpdate) {
        const itemDifference = newQuantity - itemToUpdate.quantity;
        state.itemCount += itemDifference; // Update itemCount based on quantity change
        itemToUpdate.quantity = newQuantity;
      }
    }
        
  }  
});

export const { addItemToCart, removeItemFromCart, updateCartItemQuantity } = cartSlice.actions;

export default cartSlice.reducer;
