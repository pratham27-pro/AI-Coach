import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signinSuccess } from "../../redux/user/userSlice.js"; 
import { Link } from "react-router-dom";

const Signup = ({ formData, handleChange, nextStep }) => {
  const dispatch = useDispatch();


  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-xl text-center">
  <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
  <form onSubmit={handleSubmit}>
    {/* Name input field */}
    <input
      className="w-full p-2 mb-2 border rounded"
      name="name"
      placeholder="Full Name"
      onChange={(e) => handleChange({ name: e.target.value })}
      required
    />

    {/* Email input field */}
    <input
      className="w-full p-2 mb-2 border rounded"
      type="email"
      name="email"
      placeholder="Email"
      onChange={(e) => handleChange({ email: e.target.value })}
      required
    />

    {/* Password input field */}
    <input
      className="w-full p-2 mb-2 border rounded"
      type="password"
      name="password"
      placeholder="Password"
      onChange={(e) => handleChange({ password: e.target.value })}
      required
    />

    {/* Height input field */}
    <input
      className="w-full p-2 mb-2 border rounded"
      type="number"
      name="height"
      placeholder="Height (cm)"
      onChange={(e) => handleChange({ height: e.target.value })}
      required
    />

    {/* Weight input field */}
    <input
      className="w-full p-2 mb-2 border rounded"
      type="number"
      name="weight"
      placeholder="Weight (kg)"
      onChange={(e) => handleChange({ weight: e.target.value })}
      required
    />

    {/* Gender select field */}
    <select
      className="w-full p-2 mb-2 border rounded"
      name="gender"
      onChange={(e) => handleChange({ gender: e.target.value })}
      required
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>

    {/* Fitness goal select field */}
    <select
      className="w-full p-2 mb-2 border rounded"
      name="fitnessGoal"
      onChange={(e) => handleChange({ fitnessGoal: e.target.value })}
      required
    >
      <option value="">Select Fitness Goal</option>
      <option value="Weight Loss">Weight Loss</option>
      <option value="Muscle Gain">Muscle Gain</option>
      <option value="General Fitness">General Fitness</option>
    </select>

    {/* Submit button */}
    <button className="w-full bg-blue-500 text-white py-2 rounded mt-2" type="submit">
      Next
    </button>
  </form>

  {/* Toggle between sign up and login options */}
  <Link className="mt-4 cursor-pointer text-blue-500" to={"/login"}>
    Already have an account? Login
  </Link>
</div>

  );
};

export default Signup;