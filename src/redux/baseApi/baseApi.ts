import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { logout, setToken } from "../features/auth/authSlice";

const mutex = new Mutex();

// ⭐ IMPORTANT: ONLY /api (NO ENV BACKEND URL)
const API_BASE = "/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).mentoroAuth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh-token", method: "GET" },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newToken = (refreshResult.data as any).data.accessToken;

          api.dispatch(setToken(newToken));

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Course",
    "Dashboard",
    "Payment",
    "Category",
    "Assignment",
    "Quiz",
    "Enroll",
    "Lesson",
    "Reviews",
    "Payment",
    "LiveSession",
    "Job",
    "Newsletter"
  ],
  endpoints: () => ({}),
});

export default baseApi;

