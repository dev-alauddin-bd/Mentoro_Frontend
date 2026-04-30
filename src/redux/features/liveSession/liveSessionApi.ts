import baseApi from "../../baseApi/baseApi";

const liveSessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSessions: builder.query({
      query: () => "/live-sessions",
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
    createSession: builder.mutation({
      query: (data) => ({
        url: "/live-sessions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LiveSession"] as any,
    }),
    updateSession: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/live-sessions/${id}`,
        method: "PATCH",
        body: data,
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
