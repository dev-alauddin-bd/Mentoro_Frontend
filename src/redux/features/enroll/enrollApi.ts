import baseApi from "@/redux/baseApi/baseApi";
import { IApiResponse } from "@/interfaces/course.interface";

export const enrollApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    // enrollments

    // enroll course
    enrollCourse: build.mutation(
      {
        query: (body) => ({
          url: "/enrollments",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Enroll"],
      }
    ),



    // Get all enrollments for current user
    getMyEnrollments: build.query<IApiResponse<any>, void>({
      query: () => "/enrollments/me",
      providesTags: ["Enroll"],
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

   
  }),
});

export const {
  useGetMyEnrollmentsQuery,
   useEnrollCourseMutation,
  useBecomeInstructorMutation,
  useSubmitAssignmentMutation
} = enrollApi;

