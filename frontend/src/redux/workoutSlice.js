import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateWorkoutPlan, submitWorkoutFeedback } from '../Components/Workout/API.js'; 

export const fetchWorkoutPlan = createAsyncThunk(
  'workout/generatePlan',
  async (_, { getState }) => {
    const state = getState();
    const user = state.user.currentUser;

    if (!user || !user._id) throw new Error("User not logged in");

    const requestData = {
      userId: user._id,
      fitnessGoal: user.fitnessGoal,
      fitnessLevel: user.fitnessDetails?.fitnessLevel,
      dietType: user.fitnessDetails?.dietType,
      activityLevel: user.fitnessDetails?.activityLevel,
      medicalConditions: user.medicalConditions?.conditions || [],
      allergies: user.allergies?.allergies || [],
      height: parseFloat(user.height),
      weight: parseFloat(user.weight),
      menstrualCyclePhase: user.gender === 'Female' ? user.menstrualCyclePhase : null
    };
    
    const response = await generateWorkoutPlan(requestData);
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

export default workoutSlice.reducer;