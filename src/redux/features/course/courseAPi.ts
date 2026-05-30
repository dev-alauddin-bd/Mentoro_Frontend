// src/redux/features/course/courseApi.ts

import { ICourse, ICourseResponse, ICoursesResponse, IApiResponse, IMyCourse } from "@/interfaces/course.interface";
import baseApi from "@/redux/baseApi/baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Create Course
    createCourse: build.mutation<ICourseResponse, FormData>({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    getAllPublicCourses: build.query<
      ICoursesResponse,
      { page?: number; limit?: number; search?: string; category?: string; sort?: string; showAll?: boolean } | void
    >({
      query: ({ page, limit, search, category, sort, showAll } = {}) => {
        const params = new URLSearchParams();

        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (showAll) params.append("showAll", "true");

        // 🔥 FIX: sort (NOT sortBy)
        if (sort) params.append("sort", sort);

        return `/courses?${params.toString()}`;
      },
      providesTags: ["Course"],
    }),


    getInstructorAllCourses: build.query<
      ICoursesResponse,
      { page?: number; limit?: number; search?: string; category?: string; sort?: string; showAll?: boolean } | void
    >({
      query: ({ page, limit, search, category, sort, showAll } = {}) => {
        const params = new URLSearchParams();

        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (showAll) params.append("showAll", "true");

        // 🔥 FIX: sort (NOT sortBy)
        if (sort) params.append("sort", sort);

        return `/courses/instructor?${params.toString()}`;
      },
      providesTags: ["Course"],
    }),


    // Get Single Course
    getCourseBySlug: build.query<ICourseResponse, string>({
      query: (slug) => `/courses/${slug}`,
      providesTags: ["Course"],
    }),

    // Update Course
    updateCourse: build.mutation<ICourseResponse, { slug: string; data: FormData }>({
      query: ({ slug, data }) => ({
        url: `/courses/${slug}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    // Delete Course
    deleteCourse: build.mutation<IApiResponse<{ message: string }>, string>({
      query: (slug) => ({
        url: `/courses/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // ⬇⬇⬇ *** GET MY COURSES (Student enrolled courses) ***
    getMyCourses: build.query<IApiResponse<any>, void>({
      query: () => `/courses/my-courses`,
      providesTags: ["Course"],
    }),

    // Enroll in Course
    enrollCourse: build.mutation<any, string>({
      query: (courseId) => ({
        url: `/enrollments`,
        method: "POST",
        body: { courseId }
      }),
      invalidatesTags: ["Course"],
    }),

    // Process Payment Checkout
    createCheckout: build.mutation<any, string>({
      query: (courseId) => ({
        url: `/payments/checkout`,
        method: "POST",
        body: { courseId }
      }),
    }),


    // Process Refund / Cancel Enrollment
    refundCourse: build.mutation<any, string>({
      query: (courseId) => ({
        url: `/enrollments/cancel`,
        method: "POST",
        body: { courseId }
      }),
      invalidatesTags: ["Course"],
    }),

    completeLesson: build.mutation<IApiResponse<{ message: string }>, { courseId: string; lessonId: string }>({
      query: ({ courseId, lessonId }) => ({
        url: "/courses/complete-lesson",
        method: "POST",
        body: { courseId, lessonId },
      }),
      invalidatesTags: ["Course"],
    }),

    // Toggle Publish Status
    togglePublish: build.mutation<ICourseResponse, string>({
      query: (slug) => ({
        url: `/courses/${slug}/toggle-publish`,
        method: "PATCH",
      }),
      invalidatesTags: ["Course"],
    }),

    // Request Feature
    requestFeature: build.mutation<ICourseResponse, string>({
      query: (slug) => ({
        url: `/courses/${slug}/request-feature`,
        method: "POST",
      }),
      invalidatesTags: ["Course"],
    }),

    // Approve Feature
    approveFeature: build.mutation<ICourseResponse, { slug: string; isFeatured: boolean }>({
      query: ({ slug, isFeatured }) => ({
        url: `/courses/${slug}/approve-feature`,
        method: "PATCH",
        body: { isFeatured },
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

// Hooks
export const {
  useCreateCourseMutation,
  useGetInstructorAllCoursesQuery,
  useGetAllPublicCoursesQuery,
  useGetCourseBySlugQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useEnrollCourseMutation,
  useCreateCheckoutMutation,

  useRefundCourseMutation,
  useGetMyCoursesQuery,
  useCompleteLessonMutation,
  useTogglePublishMutation,
  useRequestFeatureMutation,
  useApproveFeatureMutation
} = courseApi;
