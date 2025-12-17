import { AuthApi } from "@/feature/shared/AuthApi";
import { AvailabilityApi } from "@/feature/shared/AvailabilityApi";
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
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      AuthApi.middleware,
      AvailabilityApi.middleware,
    ]),
});

export default store;
