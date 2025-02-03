import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signinStart, signinSuccess, signinFailure } from "./userSlice";
import axios from "axios";
import Signup from "./Signup";
import Medical from "./Medical";
import Fitness from "./Fitness";
import Allergies from "./Allergies";

const MultiStepSignup = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); // Current step
  const [formData, setFormData] = useState({
    // Step 1: Signup
    name: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    gender: "",
    fitnessGoal: "",
    // Step 2: Medical History
    medicalConditions: {
      conditions: [],
      otherDisease: "",
    },
    // Step 3: Fitness Goals
    fitnessDetails: {
      fitnessLevel: "",
      dietType: "",
      activityLevel: "",
    },
    // Step 4: Allergies
    allergies: {
      allergies: [],
      otherAllergy: "",
    },
  });

  // Handle next step
  const nextStep = () => setStep(step + 1);

  // Handle previous step
  const prevStep = () => setStep(step - 1);

  // Handle form data change
  const handleChange = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Handle final submission
  const handleSubmit = async () => {
    dispatch(signinStart()); // Start loading
    try {
      const response = await axios.post("http://localhost:5000/signup", formData);
      dispatch(signinSuccess(response.data)); // Save user data in Redux store
      alert("Signup successful! Redirecting...");
      console.log(response.data);
    } catch (error) {
      console.error("Error during signup:", error);
      dispatch(signinFailure(error.message)); // Handle error
      alert("Signup failed. Please try again.");
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Signup formData={formData} handleChange={handleChange} nextStep={nextStep} />;
      case 2:
        return <Medical formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Fitness formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Allergies formData={formData} handleChange={handleChange} prevStep={prevStep} handleSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        {renderStep()}
      </div>
    </div>
  );
};

export default MultiStepSignup;