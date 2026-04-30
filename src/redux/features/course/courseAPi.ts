// src/redux/features/course/courseApi.ts

import { ICourse, ICourseResponse, ICoursesResponse, IApiResponse, IMyCourse } from "@/interfaces/course.interface";
import baseApi from "@/redux/baseApi/baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Create Course
    createCourse: build.mutation<ICourseResponse, Partial<ICourse>>({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

   getAllCourses: build.query<
  ICoursesResponse,
  { page?: number; limit?: number; search?: string; category?: string; sort?: string; instructorId?: string; showAll?: boolean } | void
>({
  query: ({ page, limit, search, category, sort, instructorId, showAll } = {}) => {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (instructorId) params.append("instructorId", instructorId);
    if (showAll) params.append("showAll", "true");

    // 🔥 FIX: sort (NOT sortBy)
    if (sort) params.append("sort", sort);

    return `/courses?${params.toString()}`;
  },
  providesTags: ["Course"],
}),

   getRecommendations: build.query({
      query: () => ({
        url: "/ai/recommendations",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    // Get Single Course
    getCourseById: build.query<ICourseResponse, string>({
      query: (id) => `/courses/${id}`,
      providesTags: ["Course"],
    }),

    // Update Course
    updateCourse: build.mutation<
      ICourseResponse,
      { id: string; data: Partial<ICourse> }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    // Delete Course
    deleteCourse: build.mutation<IApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // ⬇⬇⬇ *** GET MY COURSES (Student enrolled courses) ***
    getMyCourses: build.query<IApiResponse<IMyCourse[]>, void>({
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
      query: (id) => ({
        url: `/courses/${id}/toggle-publish`,
        method: "PATCH",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

// Hooks
export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useEnrollCourseMutation,
  useCreateCheckoutMutation,
  useGetMyCoursesQuery,
  useCompleteLessonMutation,
  useTogglePublishMutation,
  useGetRecommendationsQuery
} = courseApi;
