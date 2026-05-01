import baseApi from "@/redux/baseApi/baseApi";
import { IApiResponse } from "@/interfaces/course.interface";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<IApiResponse<any>, { page?: number; limit?: number; role?: string } | void>({
      query: (params) => ({
        url: `/users`,
        params: params ? params : undefined,
      }),
      providesTags: ["User"],
    }),
    updateUserRole: build.mutation<IApiResponse<any>, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/update-role/${id}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    updateUserStatus: build.mutation<IApiResponse<any>, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/users/update-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { 
  useGetAllUsersQuery, 
  useUpdateUserRoleMutation, 
  useUpdateUserStatusMutation 
} = userApi;
