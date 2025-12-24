import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const AdminApi = createApi({
  reducerPath: "AdminApi",
  tagTypes: ["Admin"],
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
    // Payment history endpoint
    paymentHistory: builder.query({
      query: () => "/admin/payments",
      providesTags: ["Admin"],
    }),

    // All students endpoint with defaults
    allStudent: builder.query({
      query: ({ search = "", page = 1, limit = 10 } = {}) =>
        `/admin/students?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
      providesTags: ["Admin"],
    }),
  }),
});

// Export hooks
export const { usePaymentHistoryQuery, useAllStudentQuery } = AdminApi;
