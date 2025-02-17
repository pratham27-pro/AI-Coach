import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateWorkoutPlan, submitWorkoutFeedback } from '../Components/Workout/API.js'; 

export const fetchWorkoutPlan = createAsyncThunk(
  'workout/generatePlan',
  async (_, { getState }) => {
    const state = getState();
    const user = state.user.currentUser;

    if (!user || !user._id) throw new Error("User not logged in");

    const requestData = {
      user_id: user._id,  // MongoDB ID
      email: user.email,
      fitness_goal: user.fitnessGoal,
      fitness_level: user.fitnessDetails.fitnessLevel,
      weight: user.weight,
      height: user.height,
      activity_level: user.fitnessDetails.activityLevel,
      diet_type: user.fitnessDetails.dietType,
      medical_conditions: user.medicalConditions.conditions,
      allergies: user.allergies.allergies,
    };
    
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