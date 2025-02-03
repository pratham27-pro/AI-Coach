import React, { useState } from "react";

const Medical = ({
  formData, handleChange, nextStep, prevStep
}) => {
  const [selectedConditions, setSelectedConditions] = useState(formData.medicalConditions.conditions);
  const [otherDisease, setOtherDisease] = useState(formData.medicalConditions.otherDisease);

  const conditions = [
    "Diabetes",
    "Blood Pressure",
    "Heart Disease",
    "Any Surgery",
    "Thyroid",
    "Asthma",
    "Other Disease",
    "None of These"
  ];

  const handleCheckboxChange = (condition) => {
    if (condition === "None of These") {
      setSelectedConditions(["None of These"]);
      setOtherDisease("");
    } else {
      setSelectedConditions((prev) => {
        const newSelection = prev.includes(condition)
          ? prev.filter((item) => item !== condition)
          : [...prev, condition];
        return newSelection.filter((item) => item !== "None of These");
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleChange({
      medicalConditions: {
        conditions: selectedConditions,
        otherDisease,
      },
    });
    nextStep(); // Move to the next step
  };

  return (
    <div className="p-6 sm:p-8 max-w-lg mx-auto bg-white shadow-xl rounded-2xl text-center transition-all duration-300 ease-in-out transform hover:scale-105">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Medical History</h2>
      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {conditions.map((condition) => (
            <label key={condition} className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-500 focus:ring-blue-400 focus:ring-opacity-50"
                checked={selectedConditions.includes(condition)}
                onChange={() => handleCheckboxChange(condition)}
              />
              <span className="text-lg text-gray-700">{condition}</span>
            </label>
          ))}
        </div>
        {selectedConditions.includes("Other Disease") && (
          <input
            type="text"
            className="mt-4 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Please specify other disease(s)"
            value={otherDisease}
            onChange={(e) => setOtherDisease(e.target.value)}
          />
        )}
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
      </form>
    </div>
  );
};

export default Medical;