import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const generateWorkoutPlan = async (userData) => {
//   return await axios.post(`${API_BASE_URL}/generate-workout`, userData);
    return await axios.post("/generate-workout", userData);
};

export const submitWorkoutFeedback = async (feedbackData) => {
//   return await axios.post(`${API_BASE_URL}/workout-feedback`, feedbackData);
    return await axios.post("/generate-workout", userData);
};