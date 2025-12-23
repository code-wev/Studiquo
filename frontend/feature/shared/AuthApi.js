import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const AuthApi = createApi({
  reducerPath: "AuthApi",

  // 🔥 Tags for auto refetch
  tagTypes: ["User"],

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
    // ✅ Register User
    saveUser: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Login User
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Get Logged-in User Profile
    myProfile: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),

    // ✅ Reset Password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Update Profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query:(data)=>({
        url:'auth/change-password',
        method:"PUT",
        body:data

      })
    })
  }),
});

// 🔥 Auto-generated hooks
export const {
  useSaveUserMutation,
  useLoginMutation,
  useMyProfileQuery,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation
} = AuthApi;
