import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  loadingMessage: "Loading...",
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || "Loading...";
    },
    clearLoading: (state) => {
      state.isLoading = false;
      state.loadingMessage = "Loading...";
    },
  },
});

export const { setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
