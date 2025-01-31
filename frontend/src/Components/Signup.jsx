import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signinSuccess } from "../redux/user/userSlice.js"; 

const Signup = ({ isLogin, toggleAuthMode }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    gender: "",
    fitnessGoal: "",
    medicalHistory: "",
    allergies: "",
    menstruationCycle: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signinSuccess(formData));
    alert(`${isLogin ? "Login" : "Signup"} successful! Redirecting...`);
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-xl text-center">
      <h2 className="text-3xl font-bold mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input className="w-full p-2 mb-2 border rounded" name="name" placeholder="Full Name" onChange={handleChange} required />
        )}
        <input className="w-full p-2 mb-2 border rounded" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="w-full p-2 mb-2 border rounded" type="password" name="password" placeholder="Password" onChange={handleChange} required />
        {!isLogin && (
          <>
            <input className="w-full p-2 mb-2 border rounded" type="number" name="height" placeholder="Height (cm)" onChange={handleChange} required />
            <input className="w-full p-2 mb-2 border rounded" type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} required />
            <select className="w-full p-2 mb-2 border rounded" name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select className="w-full p-2 mb-2 border rounded" name="fitnessGoal" onChange={handleChange} required>
              <option value="">Select Fitness Goal</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="General Fitness">General Fitness</option>
            </select>
            <textarea className="w-full p-2 mb-2 border rounded" name="medicalHistory" placeholder="Medical History" onChange={handleChange} required />
            <textarea className="w-full p-2 mb-2 border rounded" name="allergies" placeholder="Allergies" onChange={handleChange} required />
            <input className="w-full p-2 mb-2 border rounded" type="date" name="menstruationCycle" placeholder="Menstruation Cycle Start Date" onChange={handleChange} required />
          </>
        )}
        <button className="w-full bg-blue-500 text-white py-2 rounded mt-2" type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 cursor-pointer text-blue-500" onClick={toggleAuthMode}>
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default Signup;