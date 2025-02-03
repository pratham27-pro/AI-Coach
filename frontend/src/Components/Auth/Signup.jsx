import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signinSuccess } from "../../redux/user/userSlice.js"; 

const Signup = ({ formData, handleChange, nextStep }) => {
  const dispatch = useDispatch();


  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-xl text-center">
      <h2 className="text-3xl font-bold mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input className="w-full p-2 mb-2 border rounded" name="name" placeholder="Full Name" 
             onChange={(e) => handleChange({ name: e.target.value })}
           required />
        )}
        <input className="w-full p-2 mb-2 border rounded" type="email" name="email" placeholder="Email" 
           onChange={(e) => handleChange({ email: e.target.value })}
         required />
        <input className="w-full p-2 mb-2 border rounded" type="password" name="password" placeholder="Password" 
           onChange={(e) => handleChange({ password: e.target.value })}
         required />
        {!isLogin && (
          <>
            <input className="w-full p-2 mb-2 border rounded" type="number" name="height" placeholder="Height (cm)" 
               onChange={(e) => handleChange({ height: e.target.value })}
             required />
            <input className="w-full p-2 mb-2 border rounded" type="number" name="weight" placeholder="Weight (kg)" 
               onChange={(e) => handleChange({ weight: e.target.value })}
             required />
            <select className="w-full p-2 mb-2 border rounded" name="gender" 
               onChange={(e) => handleChange({ gender: e.target.value })}
             required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select className="w-full p-2 mb-2 border rounded" name="fitnessGoal" 
               onChange={(e) => handleChange({ fitnessGoal: e.target.value })}
             required>
              <option value="">Select Fitness Goal</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="General Fitness">General Fitness</option>
            </select>
          </>
        )}
        <button className="w-full bg-blue-500 text-white py-2 rounded mt-2" type="submit">
          Next
        </button>
      </form>
      <p className="mt-4 cursor-pointer text-blue-500" onClick={toggleAuthMode}>
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default Signup;