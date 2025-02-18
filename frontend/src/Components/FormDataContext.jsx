import React, { createContext, useState, useContext } from 'react';

// Create the context
const FormDataContext = createContext();

// Create a provider component
export function FormDataProvider({ children }) {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    console.log("The saved data from the local storage is: ", savedData);
    return savedData ? JSON.parse(savedData) : {
      // Initialize with empty default structure
      fitnessDetails: {},
      medicalConditions: {},
      allergies: {}
    };
  });

  // Update form data function
  const updateFormData = (newData) => {
    setFormData(prevData => {
      const updatedData = { ...prevData };

      // Handle nested objects properly
      Object.entries(newData).forEach(([key, value]) => {
        if (
          typeof value === 'object' && 
          value !== null && 
          key in prevData && 
          typeof prevData[key] === 'object'
        ) {
          // Merge nested objects
          updatedData[key] = {
            ...prevData[key],
            ...value
          };
        } else {
          // Set non-object values directly
          updatedData[key] = value;
        }
      });

      // Save to localStorage after updating
      localStorage.setItem('formData', JSON.stringify(updatedData));
      console.log("Saving updated form data:", updatedData);

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
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
}