import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormData } from "../FormDataContext.jsx";  // Import context
import { useDispatch, useSelector } from "react-redux";
import { signinStart, signinFailure, signinSuccess } from "../../redux/user/userSlice.js";
import axios from "axios";
import Signup from "./Signup.jsx";
import Medical from "./Medical.jsx";
import Fitness from "./Fitness.jsx";
import Allergies from "./Allergies.jsx";
import Nav from "../Nav.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData, updateFormData } = useFormData(); // Get form data and update function
  const [step, setStep] = useState(1);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  // Handle next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Handle previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Handle form data change
  const handleChange = (data) => {
    updateFormData(data); // Update the form data in context
  };

  // Handle final submission
  const handleSubmit = async () => {
    dispatch(signinStart()); 
    // Here you can submit the form data to the backend as needed
    try {
      const response = await axios.post("http://localhost:5000/api/signup", formData);
      console.log("Signup successful:", response.data);
      dispatch(signinSuccess(response.data));
      alert("Signup successful! Redirecting...");
      navigate("/dashboard"); // Navigate to another page after successful submission
    } catch (error) {
      console.error("Error during signup:", error);
      dispatch(signinFailure(error.message));
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
    <>
    <Nav/>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 pt-5 rounded-lg shadow-lg w-full max-w-2xl">
        {renderStep()}
      </div>
    </div>
    </>
  );
};

export default Profile;
