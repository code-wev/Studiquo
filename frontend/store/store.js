import { AdminApi } from "@/feature/admin/adminApi";
import { ParentApi } from "@/feature/parent/ParentApi";
import { AuthApi } from "@/feature/shared/AuthApi";
import { AvailabilityApi } from "@/feature/shared/AvailabilityApi";
import { ChatApi } from "@/feature/shared/ChatApi";
import { TutorApi } from "@/feature/shared/TutorApi";
import { BookingApi } from "@/feature/student/BookingApi";
import { StudentApi } from "@/feature/student/StudentApi";
import { configureStore } from "@reduxjs/toolkit";
// import your reducers here (uncomment and add real slices when available)
// import userReducer from "./slices/userSlice";

// Provide a minimal placeholder reducer so the store initializes during development.
// Replace or extend this with real slice reducers (e.g. userReducer) when ready.
const placeholderReducer = (state = {}, action) => state;

export const store = configureStore({
  reducer: {
    app: placeholderReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [AvailabilityApi.reducerPath]: AvailabilityApi.reducer,
    [TutorApi.reducerPath]: TutorApi.reducer,
    [StudentApi.reducerPath]: StudentApi.reducer,
    [ChatApi.reducerPath]: ChatApi.reducer,
    [BookingApi.reducerPath]: BookingApi.reducer,
    [ParentApi.reducerPath]: ParentApi.reducer,
    [AdminApi.reducerPath] : AdminApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      AuthApi.middleware,
      AvailabilityApi.middleware,
      TutorApi.middleware,
      StudentApi.middleware,
      ChatApi.middleware,
      BookingApi.middleware,
      ParentApi.middleware,
      AdminApi.middleware
    ]),
});

export default store;
