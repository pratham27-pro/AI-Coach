import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (currentUser && 
        currentUser.fitnessDetails && 
        currentUser.medicalConditions && 
        currentUser.allergies) {
      navigate("/workout");
    }
  }, [currentUser, navigate]);

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
    try {
      
      const endpoint = "http://localhost:5000/api/signup";
    const payload = {
      ...formData,
      _id: currentUser?._id // Include the ID if it exists
    };
    
    const response = await axios.post(endpoint, payload);

      // Merge form data with user data in Redux
      const userData = {
        ...(currentUser || {}),
        ...response.data.user,
        ...formData,
        fitnessDetails: formData.fitnessDetails,
        medicalConditions: formData.medicalConditions,
        allergies: formData.allergies
      };
      console.log("Dispatching user data:", userData);
      dispatch(signinSuccess(userData));
    
    // Clear form data after successful submission
      localStorage.removeItem('formData');
      navigate("/workout");
    } catch (error) {
      dispatch(signinFailure(error.message));
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
