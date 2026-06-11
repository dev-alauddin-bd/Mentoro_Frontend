import baseApi from "@/redux/baseApi/baseApi";

const liveSessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSessions: builder.query({
      query: (params) => ({
        url: "/live-sessions",
        params
      }),
      providesTags: ["LiveSession"] as any,
    }),
    getSessionById: builder.query({
      query: (id: string) => `/live-sessions/${id}`,
      providesTags: ["LiveSession"] as any,
    }),
    registerForSession: builder.mutation({
      query: (data) => ({
        url: "/live-sessions/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LiveSession"] as any,
    }),
    // createSession mutation without JSON headers
    createSession: builder.mutation({
      query: (data) => ({
        url: "/live-sessions",
        method: "POST",
        body: data,
        // Let fetch set correct multipart headers
        headers: {},
      }),
      invalidatesTags: ["LiveSession"] as any,
    }),
    // updateSession mutation accepting FormData directly
    updateSession: builder.mutation({
      query: ({ id, body }) => ({
        url: `/live-sessions/${id}`,
        method: "PATCH",
        body: body,
        headers: {},
      }),
      invalidatesTags: ["LiveSession"] as any,
    }),
    deleteSession: builder.mutation({
      query: (id) => ({
        url: `/live-sessions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LiveSession"] as any,
    }),
    getRegistrants: builder.query({
      query: (id) => `/live-sessions/${id}/registrants`,
    }),
  }),
});

export const {
  useGetAllSessionsQuery,
  useGetSessionByIdQuery,
  useRegisterForSessionMutation,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useGetRegistrantsQuery,
} = liveSessionApi;
