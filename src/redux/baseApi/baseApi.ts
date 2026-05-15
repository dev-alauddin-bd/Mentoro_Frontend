import { IUser } from "@/interfaces/user.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { logout, setUser } from "../features/auth/authSlice";

interface ITokenAndRefresh {
  accessToken: string;
  user: IUser;
}

interface IRefreshResponse {
  data: ITokenAndRefresh;
}

// Mutex to prevent multiple token refresh at once
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl:`${process.env.NEXT_PUBLIC_API_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).mentoroAuth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock();

  // console.log('🔵 API Request Initiated:', args);

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // console.warn('⚠️ 401 Unauthorized — trying to refresh token');

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // console.log('🔁 Attempting token refresh...');

        const refreshResult = await baseQuery(
          { url: "/auth/refresh-token", method: "GET" },
          api,
          extraOptions
        );

        const resultData = refreshResult.data as any;

        if (resultData?.success) {
          const newToken = resultData.data.accessToken;
          
          // Get the current user from state instead of relying on refresh response
          const currentUser = (api.getState() as any).mentoroAuth.user;

          api.dispatch(setUser({ user: currentUser, token: newToken }));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // console.log('⏳ Waiting for mutex unlock...');
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  // console.log('🟢 Final API Response:', result);
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
    "LiveSession",
    "Job",
    "Newsletter"
  ],
  endpoints: () => ({}),
});


export default baseApi;
