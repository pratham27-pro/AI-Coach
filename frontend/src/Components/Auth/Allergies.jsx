import React, { useState } from "react";

const Allergies = () => {
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [otherAllergy, setOtherAllergy] = useState("");

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

  const handleCheckboxChange = (allergy) => {
    if (allergy === "None of These") {
      setSelectedAllergies(["None of These"]);
      setOtherAllergy("");
    } else {
      setSelectedAllergies((prev) => {
        const newSelection = prev.includes(allergy)
          ? prev.filter((item) => item !== allergy)
          : [...prev, allergy];
        return newSelection.filter((item) => item !== "None of These");
      });
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-lg mx-auto bg-white shadow-xl rounded-2xl text-center transition-all duration-300 ease-in-out transform hover:scale-105">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Common Allergies</h2>
      <form>
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
        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-600 transition-all duration-200"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default Allergies;