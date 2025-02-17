from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime

class UserSync(BaseModel):
    id: int
    username: str
    email: str
    fitness_goal: str
    fitness_level: int
    available_equipment: List[str]

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