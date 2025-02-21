import React, { useState, useEffect } from "react";

const Allergies = ({ formData, handleChange, prevStep, handleSubmit }) => {
  const [selectedAllergies, setSelectedAllergies] = useState(Array.isArray(formData.allergies) ? formData.allergies : []);
  const [otherAllergy, setOtherAllergy] = useState(formData.otherAllergy || "");

  const allergies = [
    "Peanuts",
    "Tree Nuts",
    "Dairy",
    "Eggs",
    "Shellfish",
    "Wheat",
    "Soy",
    "Pollen",
    "Other Allergy",
    "None of These"
  ];

  useEffect(() => {
    // Ensure selectedAllergies is always an array
    if (!Array.isArray(selectedAllergies)) {
      setSelectedAllergies([]);
    }
  }, [selectedAllergies]);

  const handleCheckboxChange = (allergy) => {
    if (allergy === "None of These") {
      setSelectedAllergies(["None of These"]);
      setOtherAllergy(""); // Reset "Other Allergy" input when "None of These" is selected
    } else {
      setSelectedAllergies((prev) => {
        const newSelection = prev.includes(allergy)
          ? prev.filter((item) => item !== allergy)
          : [...prev, allergy];
        return Array.isArray(newSelection) ? newSelection.filter((item) => item !== "None of These") : [];
      });
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    handleChange({
      allergies: {
        allergies: selectedAllergies,
        otherAllergy,
      },
    });
    handleSubmit(); // Submit all data to the backend
  };

  return (
    <div className="p-6 sm:p-8 max-w-lg mx-auto bg-white shadow-xl rounded-2xl text-center transition-all duration-300 ease-in-out transform hover:scale-105">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Common Allergies</h2>
      <form onSubmit={handleFinalSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {allergies.map((allergy) => (
            <label key={allergy} className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-500 focus:ring-blue-400 focus:ring-opacity-50"
                checked={selectedAllergies.includes(allergy)}
                onChange={() => handleCheckboxChange(allergy)}
              />
              <span className="text-lg text-gray-700">{allergy}</span>
            </label>
          ))}
        </div>
        {selectedAllergies.includes("Other Allergy") && (
          <input
            type="text"
            className="mt-4 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Please specify other allergy(s)"
            value={otherAllergy}
            onChange={(e) => setOtherAllergy(e.target.value)}
          />
        )}
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Allergies;
