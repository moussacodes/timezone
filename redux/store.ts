// store.ts
import { configureStore } from '@reduxjs/toolkit';
import memberSlice from './features/memberSlice';
import durationSlice from './features/durationSlice';

const store = configureStore({
  reducer: {
    members: memberSlice,
    duration: durationSlice
  },
});

export default store;
