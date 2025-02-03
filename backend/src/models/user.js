import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    height: { 
        type: Number, 
        required: true 
    },
    weight: { 
        type: Number, 
        required: true 
    },
    gender: { 
        type: String, 
        enum: ["Male", "Female"], 
        required: true 
    },
    fitnessGoal: { 
        type: String, 
        enum: ["Weight Loss", "Muscle Gain", "General Fitness"], 
        required: true 
    },
    medicalConditions: {
      conditions: [{ type: String }],
      otherDisease: { type: String },
    },
    allergies: {
      allergies: [{ type: String }],
      otherAllergy: { type: String },
    },
    fitnessDetails: {
      fitnessLevel: { 
        type: String, 
        enum: ["Beginner", "Intermediate", "Advanced"], 
        required: true 
        },
      dietType: { 
        type: String, 
        enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "Keto/Paleo/Other"],
        required: true 
        },
      activityLevel: { 
        type: String, 
        enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"], 
        required: true 
        },
    }
  }, {
    timestamps: true
  });
  
const User = mongoose.model("User", userSchema);

export default User;
  