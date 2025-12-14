import { configureStore } from "@reduxjs/toolkit";
// import your reducers here
// import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {},

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([]),
});

export default store;
