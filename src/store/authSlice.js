import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  const storedAuth = localStorage.getItem("auth");
  return storedAuth
    ? {
        user: null,
        isAuthenticated: true,
        loginInfo: null,
      }
    : {
        user: null,
        isAuthenticated: false,
        loginInfo: null,
      };
};

const initialState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.loginInfo = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("auth", action.payload.access_token);
    },
    logout: (state) => {
      state.user = null;
      state.loginInfo = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
