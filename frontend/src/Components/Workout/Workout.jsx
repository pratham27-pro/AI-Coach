import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WorkoutRecommendationPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError("");

      try {
        const response = await axios.post("http://localhost:8000/workout", {
          fitnessGoal: currentUser.fitnessGoal,
          menstrualCyclePhase: currentUser.menstrualCyclePhase, // Fetch from user data
        });

        setWorkoutPlan(response.data.workoutPlan);
      } catch (error) {
        console.error("Error fetching workout plan:", error);
        setError("Failed to generate workout plan. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, [currentUser]);

  const handleExerciseClick = (exerciseName) => {
    navigate(`/posture-detection/${exerciseName}`);
  };

  if (!currentUser) {
    return <p>Please sign in to view your workout plan.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Your Personalized Workout Plan
        </h1>

        {loading && <p className="text-gray-600">Generating your workout plan...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {workoutPlan.length > 0 && (
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
                    Duration: {workout.duration} | Intensity: {workout.intensity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutRecommendationPage;