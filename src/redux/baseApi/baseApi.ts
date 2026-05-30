import { IUser } from "@/interfaces/user.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { logout, setToken, setUser } from "../features/auth/authSlice";

interface ITokenAndRefresh {
  accessToken: string;
  user: IUser;
}



const mutex = new Mutex();

const API_BASE =`${process.env.NEXT_PUBLIC_API_URL}/api`;

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

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock();

  // console.log('🔵 API Request Initiated:', args);

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // console.warn('⚠️ 401 Unauthorizationd — trying to refresh token');

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // console.log('🔁 Attempting token refresh...');

        const refreshResult = await baseQuery(
          { url: "/auth/refresh-token", method: "GET" },
          api,
          extraOptions
        );

        if (refreshResult.data && (refreshResult.data as any).success) {
          const resultData = refreshResult.data as any;
          const newToken = resultData.data.accessToken;

          // We now just update the token without risking corrupting the user state
          api.dispatch(setToken(newToken));
          result = await baseQuery(args, api, extraOptions);
        } else if (
          refreshResult.error &&
          (refreshResult.error.status === 401 || refreshResult.error.status === 403)
        ) {
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
