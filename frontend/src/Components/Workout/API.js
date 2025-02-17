// frontend/src/features/workout/workoutAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';  // FastAPI backend URL
const AUTH_API_BASE_URL = 'http://localhost:5000/api';

// Add axios interceptor for handling errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const syncUserData = async (mongoUser) => {
  try {
    // Transform MongoDB user data to match PostgreSQL schema
    const userDataForPostgres = {
      id: parseInt(mongoUser._id.toString().slice(-8), 16), // Generate a numeric ID
      username: mongoUser.email.split('@')[0], // Use email prefix as username
      email: mongoUser.email,
      fitness_goal: mongoUser.fitnessGoal,
      fitness_level: mongoUser.fitnessDetails.fitnessLevel,
      available_equipment: mongoUser.equipment || [],
      // Add any other required fields
    };

    // Call new endpoint to sync user data
    const response = await axios.post(
      `${API_BASE_URL}/sync-user`,
      userDataForPostgres
    );
    return response.data;
  } catch (error) {
    console.error('Failed to sync user data:', error);
    throw error;
  }
};

export const generateWorkoutPlan = async (userData) => {
  try {
    await syncUserData(mongoUser);

    const workoutData = {
      user_id: parseInt(mongoUser._id.toString().slice(-8), 16),
      // Add other workout request parameters
      energy_level: mongoUser.fitnessDetails?.energyLevel || 5,
      preferred_duration: mongoUser.fitnessDetails?.preferredDuration || 60
    };


    const response = await axios.post(`${API_BASE_URL}/generate-workout`, workoutData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to generate workout plan');
  }
};

export const submitWorkoutFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/workout-feedback`, feedbackData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to submit feedback');
  }
};