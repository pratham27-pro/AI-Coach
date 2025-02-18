from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from . import main

class UserSync(BaseModel):
    id: int
    username: str
    email: str
    fitness_goal: str
    fitness_level: int
    available_equipment: List[str]
    hashed_password: Optional[str] = None
    class Config:
        orm_mode = True

class WorkoutRequestFromFrontend(BaseModel):
    userId: Optional[str] = None
    fitnessGoal: str
    menstrualCyclePhase: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    medicalConditions: Optional[List[str]] = None
    lastPeriodDate: Optional[str] = None
    cycleLength: Optional[int] = None
    previousWorkouts: Optional[List[Dict[str, Any]]] = None
    fitnessProgress: Optional[Dict[str, Any]] = None
    fitnessLevel: Optional[str] = None
    dietType: Optional[str] = None
    activityLevel: Optional[str] = None
    allergies: Optional[List[str]] = None
    
    # Convert to snake_case for backend processing
    def to_backend_schema(self):
        return WorkoutRequest(
            user_id=1,  # Temporary default until user system is integrated
            fitness_goal=self.fitnessGoal,
            cycle_phase=self.menstrualCyclePhase,
            energy_level=5,  # Default energy level
            preferred_duration=None,  # Default to None
            fitness_level=main.transform_fitness_level(self.fitnessLevel),
            activity_level=main.transform_activity_level(self.activityLevel),
            diet_type=self.dietType,
            weight=float(self.weight) if self.weight else None,
            height=float(self.height) if self.height else None,
            medical_conditions=self.medicalConditions,
            allergies=self.allergies
        )

class UserBase(BaseModel):
    username: str
    email: EmailStr
    fitness_goal: str
    fitness_level: int
    available_equipment: List[str]

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    fitness_goal: Optional[str]
    fitness_level: Optional[int]
    available_equipment: Optional[List[str]]

class UserMetricsCreate(BaseModel):
    weight: float
    height: float
    body_fat: Optional[float]

class WorkoutRequest(BaseModel):
    user_id: int
    cycle_phase: Optional[str]
    energy_level: Optional[int] = 5
    preferred_duration: Optional[int]
    fitness_level: Optional[int] = None
    activity_level: Optional[str] = None
    diet_type: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    medical_conditions: Optional[List[str]] = None
    allergies: Optional[List[str]] = None

class ExerciseResponse(BaseModel):
    id: int
    name: str
    sets: int
    reps: int
    description: str
    form_tips: List[str]
    difficulty: int

class WorkoutPlanResponse(BaseModel):
    id: int
    exercises: List[ExerciseResponse]
    difficulty: float
    estimated_duration: int

class WorkoutFeedback(BaseModel):
    workout_id: int
    completed_exercises: List[int]
    difficulty_rating: int
    energy_level: int
    feedback: Optional[str]

    class Config:
        from_attributes = True