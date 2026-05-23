import baseApi from "../../baseApi/baseApi";

const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateContent: builder.mutation({
      query: (data: { topic: string }) => ({
        url: "/ai/generate-content",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGenerateContentMutation } = aiApi;
