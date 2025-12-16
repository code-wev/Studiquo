import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AuthApi = createApi({
    reducerPath:"AuthApi",
    baseQuery: fetchBaseQuery({baseUrl: base_url}),
    endpoints:(builder)=>({
        saveUser:builder.mutation({
            query:(data)=>({
                url:'/auth/register',
                method:"POST",
                body:data
            })
        }),
        login:builder.mutation({
            query:(data)=>({
                url:'/auth/login',
                method:"POST",
                body:data
            })
        }),


    })
});



export const {useSaveUserMutation, useLoginMutation} = AuthApi;