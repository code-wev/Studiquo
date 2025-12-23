import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const StudentApi = createApi({
  reducerPath: "StudentApi",
  tagTypes: ["Student"],
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({

    getExamBoard: builder.query({
      query: () => `/exam-board`,
      providesTags: ["Student"],
    }),

    updateBoard: builder.mutation({
      query: (data) => ({
        url: "/exam-board",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),

    getParentRequest: builder.query({
      query:()=>'users/me/children/requests',
      providesTags:['StatusUpdate']
    }),

    myParents: builder.query({
      query:()=>'users/my/parents',
      providesTags:['StatusUpdate']
    }),

    acceptOrRejectRequest: builder.mutation({
      query: ({id , accept}) => ({
        url:`users/me/children/requests/${id}/respond`,
        method:"POST",
        body:{accept:true}
      }),
          invalidatesTags: ["StatusUpdate"],
    }),
        onlyRejectRequest: builder.mutation({
      query: ({id , accept}) => ({
        url:`users/me/children/requests/${id}/respond`,
        method:"POST",
        body:{accept: false}
      }),
          invalidatesTags: ["StatusUpdate"],
    }),


  }),
});

export const { useGetExamBoardQuery, useUpdateBoardMutation , useGetParentRequestQuery, useMyParentsQuery, useAcceptOrRejectRequestMutation, useOnlyRejectRequestMutation} = StudentApi;


