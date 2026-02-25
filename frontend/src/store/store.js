import { configureStore } from '@reduxjs/toolkit';
import issueReducer from './issueSlice';
import workerReducer from './workerSlice';

export const store = configureStore({
  reducer: {
    issues: issueReducer,
    workers: workerReducer,
  },
});