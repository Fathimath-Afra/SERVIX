import { configureStore } from '@reduxjs/toolkit';
import issueReducer from './issueSlice';

export const store = configureStore({
  reducer: {
    issues: issueReducer,
  },
});