import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { get } from "lodash";

export const TutorApi = createApi({
  reducerPath: "TutorApi",
  tagTypes: ["Tutor", "Wallet", "Payments", "Payouts"],
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
    getTutor: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();

        // Add pagination
        queryParams.append("page", params?.page || "1");
        queryParams.append("limit", params?.limit || "12");

        // Add search
        if (params?.search) {
          queryParams.append("search", params.search);
        }

        // Add price filters
        if (params?.minHourlyRate) {
          queryParams.append("minHourlyRate", params.minHourlyRate.toString());
        }

        if (params?.maxHourlyRate) {
          queryParams.append("maxHourlyRate", params.maxHourlyRate.toString());
        }

        // Add subject filter
        if (params?.subject) {
          queryParams.append("subject", params.subject);
        }

        return {
          url: `/tutors?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Tutor"],
    }),

    tutorProfile: builder.query({
      query: (id) => `/tutors/${id}`,
    }),

    getSubjects: builder.query({
      query: () => "/subjects",
      providesTags: ["Tutor"],
    }),

    getTutorOverview: builder.query({
      query: () => "/tutors/overview",
      providesTags: ["Tutor"],
    }),

    getWalletDetails: builder.query({
      query: () => "/tutors/wallet",
      providesTags: ["Wallet"],
    }),

    getPaymentHistory: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        // Add pagination
        queryParams.append("page", get(params, "page", "1"));
        queryParams.append("limit", get(params, "limit", "10"));
        return {
          url: `/tutors/payments/history?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Payments"],
    }),

    payoutRequest: builder.mutation({
      query: (data) => ({
        url: "/tutors/payouts/request",
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Wallet", "Payouts", "Payments"],
      // Handle errors properly
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          data: response.data,
        };
      },
    }),
  }),
});

export const {
  useGetTutorQuery,
  useTutorProfileQuery,
  useGetSubjectsQuery,
  useGetTutorOverviewQuery,
  useGetWalletDetailsQuery,
  useGetPaymentHistoryQuery,
  usePayoutRequestMutation,
} = TutorApi;
