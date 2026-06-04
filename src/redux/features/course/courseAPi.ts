import { IApiResponse, ICourseDetail, ICourseResponse, ICoursesResponse } from "@/interfaces/course.interface";

import baseApi from "@/redux/baseApi/baseApi";

type CourseQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  showAll?: boolean;
};





export const courseApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({

    /* ================= CREATE COURSE ================= */
    createCourse: build.mutation<IApiResponse<ICourseResponse>, FormData>({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    /* ================= PUBLIC COURSES ================= */
    getAllPublicCourses: build.query<
      ICoursesResponse,
      CourseQueryParams | void
    >({
      query: (arg) => {
        const params = new URLSearchParams();

        if (!arg) return "/courses";

        const { page, limit, search, category, sort, showAll } = arg;

        if (page) params.append("page", String(page));
        if (limit) params.append("limit", String(limit));
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (showAll) params.append("showAll", "true");

        let backendSort = "createdAt";
        let order = "desc";

        if (sort === "price:asc") {
          backendSort = "price";
          order = "asc";
        } else if (sort === "price:desc") {
          backendSort = "price";
          order = "desc";
        }

        params.append("sort", backendSort);
        params.append("order", order);

        return `/courses?${params.toString()}`;
      },

      providesTags: ["Course"],
    }),

    /* ================= INSTRUCTOR COURSES ================= */
    /* ================= PUBLIC COURSES ================= */
    getInstructorCourses: build.query<
      ICoursesResponse,
      CourseQueryParams | void
    >({
      query: (arg) => {
        const params = new URLSearchParams();

        if (!arg) return "/courses";

        const { page, limit, search, category, sort, showAll } = arg;

        if (page) params.append("page", String(page));
        if (limit) params.append("limit", String(limit));
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (showAll) params.append("showAll", "true");

        let backendSort = "createdAt";
        let order = "desc";

        if (sort === "price:asc") {
          backendSort = "price";
          order = "asc";
        } else if (sort === "price:desc") {
          backendSort = "price";
          order = "desc";
        }

        params.append("sort", backendSort);
        params.append("order", order);

        return `/courses/instructor/me?${params.toString()}`;
      },

      providesTags: ["Course"],
    }),

    /* ================= SINGLE COURSE ================= */
    getCourseBySlug: build.query<IApiResponse<ICourseDetail>, string>({
      query: (slug) => `/courses/slug/${slug}`,
      providesTags: ["Course"],
    }),

    /* ================= UPDATE COURSE ================= */
    updateCourse: build.mutation<
      ICourseResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    /* ================= DELETE COURSE ================= */
    deleteCourse: build.mutation<
      IApiResponse<{ message: string }>,
      string
    >({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    /* ================= STUDENT ENROLLED COURSES ================= */
    getStudentEnrolledCourses: build.query<IApiResponse<any>, void>({
      query: () => ({
        url: "/courses/me/enrolled",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),


    /* ================= STUDENT COURSE MODULES (FIXED) ================= */
    getStudentCourseModules: build.query<
      IApiResponse<any>,
      string
    >({
      query: (courseId) => ({
        url: `/courses/me/${courseId}/modules`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),



    /* ================= COMPLETE LESSON ================= */
    completeLesson: build.mutation<
      IApiResponse<{ message: string }>,
      { courseId: string; lessonId: string }
    >({
      query: (body) => ({
        url: "/courses/me/lesson/complete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    /* ================= TOGGLE PUBLISH ================= */
    togglePublish: build.mutation<ICourseResponse, string>({
      query: (id) => ({
        url: `/courses/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Course"],
    }),

  }),
});

/* ================= HOOKS ================= */
export const {
  useCreateCourseMutation,
  useGetInstructorCoursesQuery,
  useGetAllPublicCoursesQuery,
  useGetCourseBySlugQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  
  useGetStudentEnrolledCoursesQuery,
  useGetStudentCourseModulesQuery,


  useCompleteLessonMutation,
  useTogglePublishMutation,
} = courseApi;