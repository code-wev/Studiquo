import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const TutorApi = createApi({
  reducerPath: "TutorApi",
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
    getTutorAvailability: builder.query({
      query: (tutorId) => `/tutors/${tutorId}/availability`,
    }),
    addTimeSlot: builder.mutation({
      query: ({ availabilityId, slotData }) => ({
        url: `/availability/${availabilityId}/slots`,
        method: "POST",
        body: slotData,
      }),
    }),
    addAvailabilityDate: builder.mutation({
      query: (dateData) => ({
        url: `/availability/date`,
        method: "POST",
        body: dateData,
      }),
    }),
  }),
});

export const {
  useGetTutorAvailabilityQuery,
  useAddTimeSlotMutation,
  useAddAvailabilityDateMutation,
} = TutorApi;
