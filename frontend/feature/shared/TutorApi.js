import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const TutorApi = createApi({
  reducerPath: "TutorApi",
  tagTypes: ["Tutor"],
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
  }),
});

export const { useGetTutorQuery, useTutorProfileQuery, useGetSubjectsQuery } =
  TutorApi;
