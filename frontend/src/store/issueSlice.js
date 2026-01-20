import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// 1. Async Thunk to fetch issues
export const fetchSocietyIssues = createAsyncThunk(
  'issues/fetchSocietyIssues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/issues/society');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const assignWorkerAction = createAsyncThunk(
  'issues/assignWorker',
  async ({ issueId, workerId }, { rejectWithValue }) => {
    try {
      const response = await API.put('/issues/assign-worker', { issueId, workerId });
      return response.data.issue; // Returns the updated issue
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const issueSlice = createSlice({
  name: 'issues',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    //  add local reducers here later for things like filtering
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocietyIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSocietyIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSocietyIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignWorkerAction.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
            state.items[index] = action.payload; // Update the specific issue in the list
        }
      });
  },
});

export default issueSlice.reducer;