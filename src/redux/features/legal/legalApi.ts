import baseApi from "@/redux/baseApi/baseApi";
import { IApiResponse } from "@/interfaces/course.interface";

export interface ILegalDocument {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const legalApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLegalDocumentBySlug: build.query<IApiResponse<ILegalDocument>, string>({
      query: (slug) => `/legal/${slug}`,
      providesTags: ["Dashboard"],
    }),
    getAllLegalDocuments: build.query<IApiResponse<ILegalDocument[]>, void>({
      query: () => "/legal",
      providesTags: ["Dashboard"],
    }),
    saveLegalDocument: build.mutation<IApiResponse<ILegalDocument>, Partial<ILegalDocument>>({
      query: (data) => ({
        url: "/legal",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetLegalDocumentBySlugQuery,
  useGetAllLegalDocumentsQuery,
  useSaveLegalDocumentMutation,
} = legalApi;
