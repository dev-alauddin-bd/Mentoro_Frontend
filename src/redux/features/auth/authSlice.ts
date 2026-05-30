// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { RootState } from "../../store";
import { IUser } from "@/interfaces/user.interface";

interface AuthState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true, // Initialized to true to wait for auth check
  error: null,
};

const authSlice = createSlice({
  name: "mentoroAuth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },

    setUser(state, action: PayloadAction<{ user: IUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
   
      state.loading = false;
      state.error = null;
    },

    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;

    },

    authFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;

    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      const payload = (action as any).payload;
      if (payload && payload.mentoroAuth) {
        state.user = payload.mentoroAuth.user;
        state.token = payload.mentoroAuth.token;
        state.error = payload.mentoroAuth.error;
        state.loading = false;
      } else {
        // If there's no persisted state, we should also set loading to false
        state.loading = false;
      }
    });
  },
});

export const { authStart, setUser, setToken, authFailure, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.mentoroAuth.user;
export const selectCurrentToken = (state: RootState) => state.mentoroAuth.token;
export const selectAuthLoading = (state: RootState) => state.mentoroAuth.loading;
export const selectAuthError = (state: RootState) => state.mentoroAuth.error;
