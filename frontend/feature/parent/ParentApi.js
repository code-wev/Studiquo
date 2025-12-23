import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const ParentApi = createApi({
  reducerPath: "ParentApi",
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
    childrenSearch: builder.query({
      query: (search) => `/users/children/search?search=${search}`,
    }),

    childrenList: builder.query({
      query: () => `/users/my/children`,
    }),

    addMyChild: builder.mutation({
      query: (studentId) => ({
        url: `/users/my/children`,
        method: "POST",
        body: { studentId },
      }),
    }),

    getMyChildren: builder.query({
      query: () => `/users/my/children`,
    }),
  }),
});

export const {
  useChildrenSearchQuery,
  useChildrenListQuery,
  useAddMyChildMutation,
  useGetMyChildrenQuery,
} = ParentApi;
