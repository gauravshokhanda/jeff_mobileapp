// store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    totalUnreadCount: 0,
  },
  reducers: {
    setTotalUnreadCount: (state, action) => {
      state.totalUnreadCount = action.payload;
    },
    decreaseUnreadCount: (state, action) => {
      state.totalUnreadCount = Math.max(state.totalUnreadCount - action.payload, 0);
    },
    resetUnreadCount: (state) => {
      state.totalUnreadCount = 0;
    },
  },
});

export const { setTotalUnreadCount, decreaseUnreadCount, resetUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;
