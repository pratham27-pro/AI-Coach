import React, { useState } from "react";

const Fitness = () => {
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [dietType, setDietType] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [activityLevel, setActivityLevel] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Fitness Level: ${fitnessLevel}\nDiet Type: ${dietType}\nFitness Goal: ${fitnessGoal}\nActivity Level: ${activityLevel}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Set Your Fitness Goals
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Current Fitness Level */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Current Fitness Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <label
                  key={level}
                  className="flex items-center space-x-3 bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <input
                    type="radio"
                    name="fitnessLevel"
                    value={level}
                    checked={fitnessLevel === level}
                    onChange={() => setFitnessLevel(level)}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Diet Type */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Preferred Diet Type
            </label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select your diet type
              </option>
              {["Vegetarian", "Non-Vegetarian", "Vegan", "Keto/Paleo/Other"].map(
                (diet) => (
                  <option key={diet} value={diet}>
                    {diet}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Primary Fitness Goal */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Primary Fitness Goal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Weight Loss",
                "Muscle Gain",
                "General Fitness",
                "Endurance Training",
              ].map((goal) => (
                <label
                  key={goal}
                  className="flex items-center space-x-3 bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <input
                    type="radio"
                    name="fitnessGoal"
                    value={goal}
                    checked={fitnessGoal === goal}
                    onChange={() => setFitnessGoal(goal)}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Daily Activity Level */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Daily Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select your activity level
              </option>
              {[
                "Sedentary (Little to no exercise)",
                "Lightly Active (1-3 workouts per week)",
                "Moderately Active (4-5 workouts per week)",
                "Very Active (Daily intense workouts)",
              ].map((activity) => (
                <option key={activity} value={activity}>
                  {activity}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Fitness;