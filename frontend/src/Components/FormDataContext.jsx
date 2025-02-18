import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Create the context
const FormDataContext = createContext();

export const useFormData = () => useContext(FormDataContext);

// Create a provider component
export function FormDataProvider({ children }) {
  const currentUser = useSelector(state => state.user.currentUser);

  const [formData, setFormData] = useState(() => {

    const defaultData = {
      name: "",
      email: "",
      password: "",
      gender: "",
      dob: "",
      height: "",
      weight: "",
      fitnessGoal: "",
      fitnessDetails: {
        fitnessLevel: "Beginner",
        dietType: "Balanced",
        activityLevel: "Moderate"
      },
      medicalConditions: { conditions: [] },
      allergies: { allergies: [] }
    };

    if (currentUser) {
      return {
        ...defaultData,
        ...currentUser,
        fitnessDetails: {
          ...defaultData.fitnessDetails,
          ...(currentUser.fitnessDetails || {})
        },
        medicalConditions: {
          ...defaultData.medicalConditions,
          ...(currentUser.medicalConditions || {})
        },
        allergies: {
          ...defaultData.allergies,
          ...(currentUser.allergies || {})
        }
      };
    }

    try {
      const savedData = localStorage.getItem('formData');
      console.log("The saved data from the local storage is: ", savedData);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return {
          ...defaultData,
          ...parsedData,
          fitnessDetails: {
            ...defaultData.fitnessDetails,
            ...(parsedData.fitnessDetails || {})
          },
          medicalConditions: {
            ...defaultData.medicalConditions,
            ...(parsedData.medicalConditions || {})
          },
          allergies: {
            ...defaultData.allergies,
            ...(parsedData.allergies || {})
          }
        };
      }
    } catch (error) {
      console.error("Error parsing saved form data:", error);
    }
    
    return defaultData;
  });

  useEffect(() => {
    if (formData) {
      localStorage.setItem('formData', JSON.stringify(formData));
      console.log("Saved updated form data to localStorage:", formData);
    }
  }, [formData]);


  const updateFormData = (data) => {
    setFormData(prevData => {
      const updatedData = { ...prevData };
      
      // Handle nested objects properly
      Object.entries(data).forEach(([key, value]) => {
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
// export function useFormData() {
//   const context = useContext(FormDataContext);
//   if (!context) {
//     throw new Error('useFormData must be used within a FormDataProvider');
//   }
//   return context;
// }