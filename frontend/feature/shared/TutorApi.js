import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const TutorApi = createApi({
    reducerPath:"TutorApi",
    tagTypes:["Tutor"],
    baseQuery: fetchBaseQuery({
        baseUrl:base_url,
          prepareHeaders: (headers) => {
              const token = Cookies.get("token");
              if (token) {
                headers.set("Authorization", `Bearer ${token}`);
              }
              return headers;
            },
    }),
    endpoints:(builder) => ({
        getTutor: builder.query({
            query:()=> "/tutors?page=1&limit=1",
            providesTags:["Tutor"]
        })
    })
});

export const {useGetTutorQuery} = TutorApi


