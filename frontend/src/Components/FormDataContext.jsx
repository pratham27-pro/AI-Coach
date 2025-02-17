import React, { createContext, useState, useContext } from 'react';

// Create the context
const FormDataContext = createContext();

// Create a provider component
export function FormDataProvider({ children }) {
  const [formData, setFormData] = useState({
    // Initial form data structure with all needed fields
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    gender: '',
    fitnessGoal: '',
    medicalConditions: {
      conditions: [],
      otherDisease: ''
    },
    fitnessDetails: {
      fitnessLevel: '',
      dietType: '',
      activityLevel: ''
    },
    allergies: {
      allergies: [],
      otherAllergy: ''
    },
    // Gender-specific data
    menstrualCyclePhase: null,
    lastPeriodDate: null,
    cycleLength: 28, // Default cycle length
  });

  // Update form data function that properly handles nested objects
  const updateFormData = (newData) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      
      // Handle regular key-value pairs
      Object.entries(newData).forEach(([key, value]) => {
        // If this is an object and already exists in the prevData, merge it
        if (typeof value === 'object' && value !== null && key in prevData && prevData[key] !== null) {
          updatedData[key] = { ...prevData[key], ...value };
        } else {
          updatedData[key] = value;
        }
      });
      
      return updatedData;
    });
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
}

// Custom hook to use the form data context
export function useFormData() {
  return useContext(FormDataContext);
}