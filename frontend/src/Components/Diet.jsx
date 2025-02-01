import React, { useState, useEffect } from "react";
import axios from "axios";

const Diet = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = 1; // Replace with actual user ID from authentication

  const fetchMealPlan = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/generate-meal-plan", {
        userId,
      });
      setMealPlan(response.data);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      setError("Failed to generate meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlan();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Your Personalized Meal Plan
        </h1>

        {loading && <p className="text-gray-600">Generating your meal plan...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {mealPlan && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Today's Meals
            </h2>
            <div className="space-y-4">
              {mealPlan.meals.map((meal) => (
                <div key={meal.id} className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {meal.title}
                  </h3>
                  <p className="text-gray-600">
                    Ready in {meal.readyInMinutes} minutes
                  </p>
                  <a
                    href={meal.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Recipe
                  </a>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
              Nutrition Summary
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-600">
                Calories: {mealPlan.nutrients.calories}
              </p>
              <p className="text-gray-600">
                Protein: {mealPlan.nutrients.protein}g
              </p>
              <p className="text-gray-600">
                Fat: {mealPlan.nutrients.fat}g
              </p>
              <p className="text-gray-600">
                Carbs: {mealPlan.nutrients.carbohydrates}g
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diet;