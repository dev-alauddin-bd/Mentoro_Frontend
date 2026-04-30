import baseApi from "../../baseApi/baseApi";

const liveSessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSessions: builder.query({
      query: () => "/live-sessions",
    }),
    getSessionById: builder.query({
      query: (id: string) => `/live-sessions/${id}`,
    }),
    registerForSession: builder.mutation({
      query: (data) => ({
        url: "/live-sessions/register",
        method: "POST",
        body: data,
      }),
    }),
    createSession: builder.mutation({
      query: (data) => ({
        url: "/live-sessions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reviews"] as any, // Reuse a tag or create new one
    }),
    updateSession: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/live-sessions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Reviews"] as any,
    }),
    deleteSession: builder.mutation({
      query: (id) => ({
        url: `/live-sessions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"] as any,
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
