import baseApi from "../../baseApi/baseApi";

const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateCourseContent: builder.mutation({
      query: (data: { topic: string }) => ({
        url: "/ai/generate-course-content",
        method: "POST",
        body: data,
      }),
    }),

    generateLiveSession: builder.mutation({
      query: (data: { title: string }) => ({
        url: "/ai/generate-live-session",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGenerateCourseContentMutation, useGenerateLiveSessionMutation } = aiApi;
