import baseApi from "@/redux/baseApi/baseApi";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllJobs: build.query({
      query: (params) => ({
        url: "/jobs",
        method: "GET",
        params,
      }),
      providesTags: ["Job"],
    }),
    getJobById: build.query({
      query: (id) => `/jobs/${id}`,
      providesTags: ["Job"],
    }),
    createJob: build.mutation({
      query: (data) => ({
        url: "/jobs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),
    updateJob: build.mutation({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),
    deleteJob: build.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),
    applyForJob: build.mutation({
      query: (data) => ({
        url: "/jobs/apply",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),
    getAllApplications: build.query({
      query: () => "/jobs/admin/applications",
      providesTags: ["Job"],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyForJobMutation,
  useGetAllApplicationsQuery,
} = jobApi;
