// ====================================================
// 🧾 Auth API Module - User Authentication & Management
// ====================================================

import baseApi from "@/redux/baseApi/baseApi";


// ===== 🔹 Inject auth-related endpoints into baseApi =====
const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ===== ✅ Signup user =====
    signUp: build.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    // ===== ✅ Login user =====
    login: build.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),



    // ===== ✅ Logout user =====
    logout: build.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

// =====  Export auto-generated hooks =====
export const {
  useSignUpMutation,
  useLoginMutation,

  useLogoutMutation,
} = authApi;

export default authApi;
