import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const StudentApi = createApi({
    reducerPath:"StudentApi",
    tagTypes:['Student'],
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

    endpoints:(builder)=>({
        getExamBoard: builder.query({
            query:()=>`/exam-board`,
            providesTags:['Student']

        }),
        updateBoard: builder.mutation({
            query:(data)=>({
                url:`/exam-board`,
                method:"PUT",
                body:data


            }),
            invalidatesTags:['Student']
        })
        
    })
});



export const {useGetExamBoardQuery, useUpdateBoardMutation} = StudentApi