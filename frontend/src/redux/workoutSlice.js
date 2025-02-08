import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateWorkoutPlan, submitWorkoutFeedback } from './workoutAPI';

export const fetchWorkoutPlan = createAsyncThunk(
  'workout/generatePlan',
  async (userData) => {
    const response = await generateWorkoutPlan(userData);
    return response.data;
  }
);

export const workoutSlice = createSlice({
  name: 'workout',
  initialState: {
    currentPlan: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkoutPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkoutPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })
      .addCase(fetchWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});