import { UserApi } from "@/feature/UserApi";
import { configureStore } from "@reduxjs/toolkit";
// import your reducers here
// import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
     [UserApi.reducerPath]:UserApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([

      UserApi.middleware
    ]),
});

export default store;
