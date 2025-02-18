import React from "react";
import { useFormData } from "../FormDataContext.jsx";

const Fitness = ({
  // formData, handleChange, nextStep, prevStep
  nextStep, prevStep
}) => {

  const { formData, updateFormData } = useFormData();

  const handleChange = (updates) => {
    // Merge the updates with the existing formData
    updateFormData({
      ...formData,
      ...updates,
      // If updates contain fitnessDetails, merge them properly
      fitnessDetails: updates.fitnessDetails 
        ? { ...formData.fitnessDetails, ...updates.fitnessDetails }
        : formData.fitnessDetails
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData({

      fitnessGoal: formData.fitnessGoal,

      fitnessDetails: {
      fitnessLevel: formData.fitnessDetails?.fitnessLevel || formData.fitnessLevel,
      dietType: formData.fitnessDetails?.dietType || formData.dietType,
      activityLevel: formData.fitnessDetails?.activityLevel || formData.activityLevel,
    },
      menstrualTracking: formData.menstrualTracking,
      cycleLength: formData.cycleLength,
      lastPeriodDate: formData.lastPeriodDate,
    });
    console.log("Updated fitness data:", formData);
    nextStep(); // Move to the next step
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
                    checked={formData.fitnessDetails?.fitnessLevel === level || formData.fitnessLevel === level}
                    onChange={() => handleChange({ 
                      fitnessDetails: {
                        ...formData.fitnessDetails,
                        fitnessLevel: level 
                      }
                    })}
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
              value={formData.fitnessDetails?.dietType || formData.dietType || ""}
              onChange={(e) => handleChange({ 
                fitnessDetails: {
                  ...formData.fitnessDetails,
                  dietType: e.target.value 
                }
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select your diet type</option>
              {["Vegetarian", "Non-Vegetarian", "Vegan", "Keto/Paleo/Other"].map((diet) => (
                <option key={diet} value={diet}>{diet}</option>
              ))}
            </select>
          </div>

          {/* Primary Fitness Goal */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Primary Fitness Goal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Weight Loss", "Muscle Gain", "General Fitness", "Endurance Training"].map((goal) => (
                <label
                  key={goal}
                  className="flex items-center space-x-3 bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <input
                    type="radio"
                    name="fitnessGoal"
                    checked={formData.fitnessGoal === goal}
                    value={goal}
                    onChange={() => handleChange({ fitnessGoal: goal })}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Daily Activity Level
            </label>
            <select
              value={formData.fitnessDetails?.activityLevel || formData.activityLevel || ""}
              onChange={(e) => handleChange({ 
                fitnessDetails: {
                  ...formData.fitnessDetails,
                  activityLevel: e.target.value 
                }
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select your activity level</option>
              {["Sedentary (Little to no exercise)", "Lightly Active (1-3 workouts per week)", "Moderately Active (4-5 workouts per week)", "Very Active (Daily intense workouts)"].map((activity) => (
                <option key={activity} value={activity}>{activity}</option>
              ))}
            </select>
          </div>

          {/* Menstrual Tracking */}
          {formData.gender === "Female" && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Would you like to track your menstrual cycle for personalized workouts?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Yes", "No"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <input
                      type="radio"
                      name="menstrualTracking"
                      value={option}
                      checked={formData.menstrualTracking === option}
                      onChange={() => handleChange({ menstrualTracking: option })}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Additional Menstrual Tracking Fields (Conditional) */}
          {formData.gender === "Female" && formData.menstrualTracking === "Yes" && (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Average Cycle Length (days)
                </label>
                <select
                  value={formData.cycleLength || ""}
                  onChange={(e) => handleChange({ cycleLength: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select cycle length</option>
                  {[...Array(15)].map((_, i) => (
                    <option key={i + 21} value={i + 21}>{i + 21} days</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  First Day of Last Period
                </label>
                <input
                  type="date"
                  value={formData.lastPeriodDate || ""}
                  onChange={(e) => handleChange({ lastPeriodDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Fitness;