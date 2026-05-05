import baseApi from "@/redux/baseApi/baseApi";
import { IApiResponse } from "@/interfaces/course.interface";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminAnalytics: build.query<IApiResponse<any>, void>({
      query: () => `/dashboard/admin-analytics`,
      providesTags: ["Course"],
    }),
    getInstructorAnalytics: build.query<IApiResponse<any>, void>({
      query: () => `/dashboard/instructor-analytics`,
      providesTags: ["Course"],
    }),
    getStudentAnalytics: build.query<IApiResponse<any>, void>({
      query: () => `/dashboard/student-analytics`,
      providesTags: ["Course"],
    }),
  }),
});

export const { 
  useGetAdminAnalyticsQuery, 
  useGetInstructorAnalyticsQuery, 
  useGetStudentAnalyticsQuery 
} = dashboardApi;

