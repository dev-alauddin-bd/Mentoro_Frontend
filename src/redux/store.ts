// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cmAuth from "@/redux/features/auth/authSlice";
import baseApi from "@/redux/baseApi/baseApi";
import progressReducer from "@/redux/slices/coursesSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

// 1️⃣ combine reducers
const rootReducer = combineReducers({
  cmAuth,
  progress: progressReducer, 
  [baseApi.reducerPath]: baseApi.reducer,
});

// 2️⃣ persist config
const persistConfig = {
  key: "course-master-v1", // Changed key to v1 to clear old state like 'AFAuth'
  storage,
  whitelist: ["cmAuth","progress"], 
};

// 3️⃣ persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// 5️⃣ persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
