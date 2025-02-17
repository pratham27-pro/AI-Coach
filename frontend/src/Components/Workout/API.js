// frontend/src/features/workout/workoutAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';  // FastAPI backend URL
const AUTH_API_BASE_URL = 'http://localhost:5000/api';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const syncUserData = async (userData) => {
  try {
    if (!userData) {
      throw new Error('No user data provided for sync');
    }
    
    if (!userData._id) {
      throw new Error('User data is missing ID. Please ensure user is properly authenticated.');
    }
    console.log('Syncing user data to PostgreSQL. User ID:', userData._id);

    let postgresId;
    try {
      postgresId = parseInt(userData._id.toString().slice(-8), 16);
    } catch (e) {
      console.warn('Could not convert MongoDB ID to numeric format:', e);

      postgresId = Math.abs(
        userData._id.toString().split('').reduce((acc, char) => 
          (acc * 31 + char.charCodeAt(0)) & 0xFFFFFFFF, 0)
      );
    }

    const userDataForPostgres = {
      id: postgresId,
      username: userData.name || (userData.email ? userData.email.split('@')[0] : 'user'),
      email: userData.email || 'unknown@example.com',
      fitness_goal: userData.fitnessGoal || 'general',
      fitness_level: transformFitnessLevelToInt(userData.fitnessDetails?.fitnessLevel), // Convert string to int
      available_equipment: [] 
    };

    console.log('Transformed PostgreSQL data:', userDataForPostgres);

    const response = await axios.post(
      `${API_BASE_URL}/sync-user`,
      userDataForPostgres
    );
    console.log('User data synced successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to sync user data:', error);
    throw error;
  }
};

const transformFitnessLevelToInt = (level) => {
  const levels = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3
  };
  return levels[level] || 1; // Default to 1 if level is not found
};

export const generateWorkoutPlan = async (userData) => {
  try {
    if (!userData || !userData._id) {
      throw new Error('Valid user data with ID is required to generate workout plan');
    }
    
    console.log('Generating workout plan for user ID:', userData._id);

    await syncUserData(userData);

    const workoutData = {
      userId: userData._id.toString(),
      fitnessGoal: userData.fitnessGoal || 'general fitness',
      height: parseFloat(userData.height) || 170,
      weight: parseFloat(userData.weight) || 70,
      fitnessLevel: userData.fitnessDetails?.fitnessLevel || 'Beginner',
      dietType: userData.fitnessDetails?.dietType || 'Balanced',
      activityLevel: userData.fitnessDetails?.activityLevel || 'Moderate',
      medicalConditions: userData.medicalConditions?.conditions || [],
      allergies: userData.allergies?.allergies || [],
      menstrualCyclePhase: userData.menstrualCyclePhase || null,
      lastPeriodDate: userData.lastPeriodDate || null,
      cycleLength: userData.cycleLength || null
    };

    console.log('Generating workout with data:', workoutData);

    const response = await axios.post(`${API_BASE_URL}/generate-workout`, workoutData);
    return response.data;
  } catch (error) {
    console.error('Workout generation error:', error);
    throw new Error(error.response?.data?.detail || error.message || 'Failed to generate workout plan');
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