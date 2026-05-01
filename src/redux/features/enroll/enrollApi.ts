import baseApi from "@/redux/baseApi/baseApi";
import { IApiResponse } from "@/interfaces/course.interface";

export const enrollApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    // Get all enrollments for current user
    getMyEnrollments: build.query<IApiResponse<any>, void>({
      query: () => "/enrollments/me",
      providesTags: ["Enroll"],
    }),

    // Get curriculum/content for a specific enrolled course
    getEnrolledCourseContent: build.query<IApiResponse<any>, string>({
      query: (courseId) => `/enrollments/courses/${courseId}`,
      providesTags: (result, error, courseId) => [{ type: "Enroll", id: courseId }],
    }),

    // Upgrade account to instructor
    becomeInstructor: build.mutation<IApiResponse<any>, void>({
      query: () => ({
        url: "/users/become-instructor",
        method: "POST",
      }),
      invalidatesTags: ["Enroll"],
    }),

    // Submit assignment (student)
    submitAssignment: build.mutation<IApiResponse<any>, { assignmentId: string; content: string }>({
      query: (body) => ({
        url: "/submissions/assignments/submit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Enroll"],
    }),

    // Submit quiz (student)
    submitQuiz: build.mutation<IApiResponse<any>, { quizId: string; answers: number[] }>({
      query: (body) => ({
        url: "/submissions/quizs/submit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Enroll"],
    }),
  }),
});

export const {
  useGetMyEnrollmentsQuery,
  useGetEnrolledCourseContentQuery,
  useBecomeInstructorMutation,
  useSubmitAssignmentMutation,
  useSubmitQuizMutation,
} = enrollApi;

