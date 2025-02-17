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
        enum: ["Weight Loss", "Muscle Gain", "General Fitness", "Endurance Training"], 
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
        enum: ["Sedentary (Little to no exercise)", "Lightly Active (1-3 workouts per week)", "Moderately Active (4-5 workouts per week)", "Very Active (Daily intense workouts)"], 
        required: true 
        },
    },
    // Menstrual Tracking Fields
    menstrualTracking: {
      type: String,
      enum: ["Yes", "No"],
      default: "No"
    },
    cycleLength: {
      type: Number,
      min: 21,
      max: 35,
      default: 28
    },
    lastPeriodDate: {
      type: Date
    },
    // Derived field - computed by backend
    menstrualCyclePhase: {
      type: String,
      enum: ["menstrual", "follicular", "ovulation", "luteal", null],
      default: null
    }
  }, {
    timestamps: true
  });

// Method to calculate current menstrual cycle phase
userSchema.methods.calculateCyclePhase = function() {
  if (this.gender !== "Female" || this.menstrualTracking !== "Yes" || !this.lastPeriodDate) {
    this.menstrualCyclePhase = null;
    return null;
  }

  const today = new Date();
  const lastPeriod = new Date(this.lastPeriodDate);
  const cycleLength = this.cycleLength || 28;
  
  // Calculate days since last period
  const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
  const currentCycleDay = (daysSinceLastPeriod % cycleLength) + 1;
  
  // Determine phase based on cycle day
  if (currentCycleDay <= 5) {
    this.menstrualCyclePhase = "menstrual";
  } else if (currentCycleDay <= 13) {
    this.menstrualCyclePhase = "follicular";
  } else if (currentCycleDay <= 16) {
    this.menstrualCyclePhase = "ovulation";
  } else {
    this.menstrualCyclePhase = "luteal";
  }
  
  return this.menstrualCyclePhase;
};

// Pre-save hook to calculate cycle phase
userSchema.pre('save', function(next) {
  if (this.gender === "Female" && this.menstrualTracking === "Yes" && this.lastPeriodDate) {
    this.calculateCyclePhase();
  }
  next();
});
  
const User = mongoose.model("User", userSchema);

export default User;