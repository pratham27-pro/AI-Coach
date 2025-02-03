import User from "../models/user.js";

export const signup = async (req, res, next) => {
    const {
        name,
        email,
        password,
        height,
        weight,
        gender,
        fitnessGoal,
        medicalConditions,
        allergies,
        fitnessDetails,
      } = req.body;
    
      try {
        const newUser = new User({
          name,
          email,
          password,
          height,
          weight,
          gender,
          fitnessGoal,
          medicalConditions,
          allergies,
          fitnessDetails,
        });
    
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
      }
};