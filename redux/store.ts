// store.ts
import { configureStore } from '@reduxjs/toolkit';
import memberSlice from './features/memberSlice';

const store = configureStore({
  reducer: {
    members: memberSlice,
  },
});

export default store;
