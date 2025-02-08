// frontend/src/features/workout/workoutAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';  // FastAPI backend URL

// Add axios interceptor for handling errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const generateWorkoutPlan = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-workout`, userData);
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