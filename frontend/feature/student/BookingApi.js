import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const BookingApi = createApi({
  reducerPath: "BookingApi",
  tagTypes: ["Booking"],
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
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),

    getMyChildrenBookings: builder.query({
      query: (arg) => {
        const { page = 1, limit = 10 } = arg || {};
        return {
          url: `bookings/children-bookings?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["Booking"],
    }),

    makePayment: builder.mutation({
      query: (data) => ({
        url: "/bookings/create-payment-link",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateBookingMutation, useGetMyChildrenBookingsQuery } =
  BookingApi;
