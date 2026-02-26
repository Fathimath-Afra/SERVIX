import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const fetchWorkers = createAsyncThunk(
    'workers/fetchWorkers',
    async (params = {}, { rejectWithValue }) => {
        try {
            const { search = "", page = 1 } = params;
            const response = await API.get(`/manager/workers?search=${search}&page=${page}&limit=6`);
            return response.data; 
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


export const createWorkerAction = createAsyncThunk(
    'workers/createWorker',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await API.post('/manager/create-worker', formData);
            return response.data.worker;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


export const updateWorkerAction = createAsyncThunk(
    'workers/updateWorker',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/manager/update-worker/${id}`, formData);
            return response.data.worker; // The updated worker object
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);



export const deleteWorkerAction = createAsyncThunk(
    'workers/deleteWorker',
    async (id, { rejectWithValue }) => {
        try {
            await API.delete(`/manager/delete-worker/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const workerSlice = createSlice({
    name: 'workers',
    initialState: {
        items: [],
        totalPages: 1,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            
            .addCase(fetchWorkers.pending, (state) => { state.loading = true; })
            .addCase(fetchWorkers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.workers;
                state.totalPages = action.payload.totalPages;
            })
            
            .addCase(createWorkerAction.fulfilled, (state, action) => {
                state.items.unshift(action.payload); // Add new worker to top
            })
            
            .addCase(deleteWorkerAction.fulfilled, (state, action) => {
                state.items = state.items.filter(w => w._id !== action.payload);
            })
            .addCase(updateWorkerAction.fulfilled, (state, action) => {
                const index = state.items.findIndex(w => w._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload; 
                }
            })
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
});

export default workerSlice.reducer;
