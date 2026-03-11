import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';


export const fetchSocietyIssues = createAsyncThunk(
    'issues/fetchSocietyIssues',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { search = "", status = "all", page = 1 } = params;
            const response = await API.get(`/issues/society?search=${search}&status=${status}&page=${page}`);
            return response.data; // returns { issues, totalPages, ... }
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

// Thunk to fetch tasks for workers
export const fetchWorkerTasks = createAsyncThunk(
  'issues/fetchWorkerTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/issues/my-tasks');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk to update status
export const updateIssueStatus = createAsyncThunk(
  'issues/updateStatus',
  async ({ id, status ,workerNote , amount}, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/issues/${id}/status`, { status ,workerNote,amount});
      return response.data.issue;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


//to fetch citizen's own issue
export const fetchCitizenIssues = createAsyncThunk(
  'issues/fetchCitizenIssues',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await API.get(`/issues/my-reports?page=${page}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const deleteIssueAction = createAsyncThunk(
    'issues/deleteIssue',
    async (id, { rejectWithValue }) => {
        try {
            await API.delete(`/issue/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


export const updateIssueAction = createAsyncThunk(
    'issues/updateIssue',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/issue/${id}`, formData);
            return response.data.issue;
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
    totalPages : 1,
    error: null,
    totalPages: 0
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
        state.items = action.payload.issues; 
        state.totalPages = action.payload.totalPages; 
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
      })
     
      .addCase(fetchWorkerTasks.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        const updatedIssue = action.payload; 
    
        const index = state.items.findIndex(i => i._id === updatedIssue._id);
        if (index !== -1) state.items[index] = updatedIssue;
      })

      .addCase(fetchCitizenIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.issues;
        state.totalPages = action.payload.totalPages;
      })

      .addCase(deleteIssueAction.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      
      .addCase(updateIssueAction.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
    })

    // Handle Errors
    .addMatcher(
      (action) => action.type.endsWith('/rejected'),
          (state, action) => {
              state.loading = false;
              state.error = action.payload;
    });
  },
});

export default issueSlice.reducer;