// store.ts
import { configureStore } from "@reduxjs/toolkit";
import memberSlice from "./features/memberSlice";
 
const store = configureStore({
  reducer: {
    members: memberSlice,
   },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
