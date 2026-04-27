// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IUser } from "@/interfaces/user.interface";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  avatar?: string | null;
  createdAt?: string | Date | null;
  bio?: string | null;
}
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true, // Initialized to true to wait for auth check
  error: null,
};

const authSlice = createSlice({
  name: "cmAuth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },

    setUser(state, action: PayloadAction<{ user: IUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    authFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { authStart, setUser, authFailure, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.cmAuth.user;
export const selectCurrentToken = (state: RootState) => state.cmAuth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.cmAuth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.cmAuth.loading;
export const selectAuthError = (state: RootState) => state.cmAuth.error;
