import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormData } from "../FormDataContext.jsx";
import { generateWorkoutPlan } from "./API.js"; // Import the API function
import { store } from "../../redux/store.js";

const Workout = () => {
  const { currentUser, loading: authLoading } = useSelector((state) => state.user);
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { formData } = useFormData();
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const state = store.getState();
    console.log('Current Redux State:', state);
    console.log('Current User:', state.user.currentUser);
  }, []);

  // Check if authentication is complete and profile data exists
  useEffect(() => {
    console.log("Auth state:", { currentUser, authLoading });
    
    if (authLoading) {
      console.log("Authentication is still loading...");
      return;
    }
    
    if (!currentUser || (!currentUser._id && (!currentUser.user || !currentUser.user._id))) {
      console.log("No authenticated user found");
      setError("Please sign in to view your workout plan");
      return;
    }
    
    if (!formData) {
      console.log("Form data is not available");
      setError("Profile data is missing");
      return;
    }
    
    // Check if required fields exist in the nested structure
    const isComplete = 
      formData.fitnessGoal && 
      formData.fitnessDetails?.fitnessLevel &&
      formData.fitnessDetails?.dietType &&
      formData.fitnessDetails?.activityLevel;

    setProfileComplete(isComplete);

    if (!isComplete) {
      const missingFields = [];
      if (!formData.fitnessGoal) missingFields.push('Fitness Goal');
      if (!formData.fitnessDetails?.fitnessLevel) missingFields.push('Fitness Level');
      if (!formData.fitnessDetails?.dietType) missingFields.push('Diet Type');
      if (!formData.fitnessDetails?.activityLevel) missingFields.push('Activity Level');

      setError(`Please complete your profile by providing: ${missingFields.join(', ')}`);
      console.log(`Profile incomplete, missing: ${missingFields.join(', ')}`);
    } else {
      setError("");
      console.log("Profile is complete, ready to fetch workout plan");
    }
  }, [currentUser, authLoading, formData]);

  // Fetch workout plan when profile is complete
  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      if (authLoading) {
        console.log("Authentication is still loading...");
        return;
      }
      
      if (!currentUser || !currentUser._id) {
        console.log("No authenticated user found");
        setError("Please sign in to view your workout plan");
        return;
      }
      
      if (!formData) {
        console.log("The form data is missing.")
        return;
      }
      
      if (!profileComplete) {
        console.log('Profile incomplete, skipping workout plan fetch');
        return;
      }

      setLoading(true);
      setError("");

      const fitnessData = {
        fitnessGoal: currentUser.fitnessGoal || formData?.fitnessGoal,
        fitnessLevel: currentUser.fitnessDetails?.fitnessLevel || formData?.fitnessDetails?.fitnessLevel,
        dietType: currentUser.fitnessDetails?.dietType || formData?.fitnessDetails?.dietType,
        activityLevel: currentUser.fitnessDetails?.activityLevel || formData?.fitnessDetails?.activityLevel
      };
    
      console.log('Fitness data check:', fitnessData); // Debug log
    
      const missingFields = [];
      if (!fitnessData.fitnessGoal) missingFields.push('Fitness Goal');
      if (!fitnessData.fitnessLevel) missingFields.push('Fitness Level');
      if (!fitnessData.dietType) missingFields.push('Diet Type');
      if (!fitnessData.activityLevel) missingFields.push('Activity Level');
    
      setProfileComplete(missingFields.length === 0);
    
      if (missingFields.length > 0) {
        setError(`Please complete your profile by providing: ${missingFields.join(', ')}`);
        console.log(`Profile incomplete, missing: ${missingFields.join(', ')}`);
      } else {
        setError("");
        console.log("Profile is complete, ready to fetch workout plan");
      }

      try {
        console.log('Current user:', currentUser);
        console.log('Form data:', formData);
        
        // Create a merged user object with all necessary data
        const userWithFormData = {
          ...currentUser,
          _id: currentUser._id || currentUser.user._id, // Handle both structures
          fitnessGoal: formData.fitnessGoal,
          height: formData.height || "170",
          weight: formData.weight || "70",
          fitnessDetails: formData.fitnessDetails || {},
          medicalConditions: formData.medicalConditions || {},
          allergies: formData.allergies || {},
          gender: formData.gender || 'Prefer not to say',
          lastPeriodDate: formData.lastPeriodDate || null,
          cycleLength: formData.cycleLength || 28,
        };

        if (userWithFormData.gender === 'Female' && formData.lastPeriodDate) {
          userWithFormData.menstrualCyclePhase = determineCurrentPhase(
            formData.lastPeriodDate, 
            formData.cycleLength || 28
          );
        }

        console.log('Merged user data:', userWithFormData);
        console.log('User ID check:', userWithFormData._id);

        // Use the API function instead of direct axios call
        const response = await generateWorkoutPlan(userWithFormData);

        if (response.workoutPlan) {
          setWorkoutPlan(response.workoutPlan);
        } else {
          setError("Received invalid workout plan format");
        }
      } catch (error) {
        console.error("Error fetching workout plan:", error);
        setError(
          error.message || 
          "Failed to generate workout plan. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, [currentUser, formData, profileComplete, authLoading]);

  const determineCurrentPhase = (lastPeriodDate, cycleLength = 28) => {
    if (!lastPeriodDate) return null;
    
    const daysSinceLastPeriod = Math.floor(
      (new Date() - new Date(lastPeriodDate)) / (1000 * 60 * 60 * 24)
    );
    
    const dayInCycle = daysSinceLastPeriod % cycleLength;
    
    if (dayInCycle < 7) return 'menstrual';
    if (dayInCycle < 14) return 'follicular';
    if (dayInCycle < 17) return 'ovulation';
    return 'luteal';
  };

  const handleExerciseClick = (exerciseName) => {
    navigate(`/posture-detection/${exerciseName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  // Loading state during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  // Check for authentication
  if (!currentUser || !currentUser._id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-4">Please sign in to view your workout plan.</p>
          <button 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Check for incomplete profile
  if (!profileComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/profile')}
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Your Personalized Workout Plan
        </h1>

        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-600">Generating your workout plan...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {workoutPlan.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Today's Workouts
            </h2>
            <div className="space-y-4">
              {workoutPlan.map((workout, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => handleExerciseClick(workout.name)}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {workout.name}
                  </h3>
                  <p className="text-gray-600">
                    Sets: {workout.sets} | Reps: {workout.reps}
                  </p>
                  <p className="text-gray-600">
                    Duration: {workout.duration} | Intensity: {workout.intensity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : !loading && (
          <p className="text-gray-600 text-center py-4">
            No workout plan available. Try refreshing the page.
          </p>
        )}
      </div>
    </div>
  );
};

export default Workout;