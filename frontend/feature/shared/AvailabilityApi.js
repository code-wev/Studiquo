import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const AvailabilityApi = createApi({
  reducerPath: "AvailabilityApi",
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
    addAvailabilityDate: builder.mutation({
      query: (dateData) => ({
        url: `/availability/date`,
        method: "POST",
        body: dateData,
      }),
    }),
    addTimeSlot: builder.mutation({
      query: ({ availabilityId, slotData }) => ({
        url: `/availability/date/${availabilityId}/slots`,
        method: "POST",
        body: slotData,
      }),
    }),
    getTutorAvailability: builder.query({
      query: (tutorId) => `/tutors/${tutorId}/availability`,
    }),
    deleteTutorAvailability: builder.mutation({
      query: (availabilityId) => ({
        url: `/availability/date/${availabilityId}`,
        method: "DELETE",
      }),
    }),
    deleteTimeSlot: builder.mutation({
      query: ({ slotId }) => ({
        url: `/availability/slots/${slotId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddAvailabilityDateMutation,
  useAddTimeSlotMutation,
  useGetTutorAvailabilityQuery,
  useDeleteTutorAvailabilityMutation,
  useDeleteTimeSlotMutation,
} = AvailabilityApi;
