import React, { createContext, useContext, useState } from "react";

// Create context
const FormDataContext = createContext();

// Provider component
export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    gender: "",
    fitnessGoal: "",
    medicalConditions: { conditions: [], otherDisease: "" },
    fitnessDetails: { fitnessLevel: "", dietType: "", activityLevel: "" },
    allergies: { allergies: [], otherAllergy: "" },
  });

  const updateFormData = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

// Custom hook to use the FormDataContext
export const useFormData = () => {
  return useContext(FormDataContext);
};
