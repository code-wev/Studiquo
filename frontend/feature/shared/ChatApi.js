import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const ChatApi = createApi({
  reducerPath: "ChatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => "/chat/groups",
      transformResponse: (response) => response.data, // Extract data from response
    }),
    getMessages: builder.query({
      query: ({ groupId, page = 1, limit = 40 }) =>
        `/chat/${groupId}/messages?page=${page}&limit=${limit}`,
      transformResponse: (response) => response.data || response,
    }),
    postMessage: builder.mutation({
      query: ({ groupId, body }) => ({
        url: `/chat/${groupId}/message`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetMessagesQuery,
  usePostMessageMutation,
} = ChatApi;
