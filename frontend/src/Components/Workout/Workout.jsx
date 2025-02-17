import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Workout = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const requiredFields = ['fitnessGoal', 'fitnessLevel', 'dietType', 'activityLevel'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setProfileComplete(false);
        setError(`Please complete your profile by providing: ${missingFields.join(', ')}`);
      } else {
        setProfileComplete(true);
        setError("");
      }
    }
  }, [currentUser, formData]);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError("");

      try {
        // Create a comprehensive request object that matches the schema expected by the backend
        const requestData = {
          userId: currentUser._id || formData._id,
          fitnessGoal: formData.fitnessGoal,
          
          // Physical metrics from form data
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          
          // Fitness details from form data
          fitnessLevel: formData.fitnessLevel,
          dietType: formData.dietType,
          activityLevel: formData.activityLevel,
          
          // Medical conditions from form data
          medicalConditions: formData.medicalConditions?.conditions || [],
          
          // Allergies info from form data
          allergies: formData.allergies?.allergies || [],
          
          // Menstrual cycle info (if applicable)
          menstrualCyclePhase: formData.gender === 'Female' ? 
                               determineCurrentPhase(formData.lastPeriodDate, formData.cycleLength) : 
                               null
        };

        console.log('Sending request with data:', requestData); // Debug log

        const response = await axios.post(
          "http://127.0.0.1:8000/api/generate-workout",
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        console.log('Received response:', response.data); // Debug log

        if (response.data.workoutPlan) {
          setWorkoutPlan(response.data.workoutPlan);
        } else {
          setError("Received invalid workout plan format");
        }
      } catch (error) {
        console.error("Error fetching workout plan:", error.response || error);
        setError(
          error.response?.data?.detail || 
          "Failed to generate workout plan. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, [currentUser]);

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
    navigate(`/posture-detection/${exerciseName}`);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Please sign in to view your workout plan.</p>
      </div>
    );
  }

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