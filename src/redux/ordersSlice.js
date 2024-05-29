// src/redux/ordersSlice.js

import { createSlice } from '@reduxjs/toolkit';

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    newOrdersCount: 0,
  },
  reducers: {
    setNewOrdersCount: (state, action) => {
      state.newOrdersCount = action.payload;
    },
  },
});

export const { setNewOrdersCount } = ordersSlice.actions;

export default ordersSlice.reducer;
