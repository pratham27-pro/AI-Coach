from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from . import models, schemas
from .recommendation.engine import WorkoutRecommender
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from typing import List, Dict, Any
from .recommendation import utils

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:happy@localhost:5432/postgres")

print(SQLALCHEMY_DATABASE_URL) 

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the .env file")

# Create the SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a sessionmaker factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for the models
Base = declarative_base()

def get_db():
    """Create a new SQLAlchemy session."""
    db = SessionLocal()
    try:
        yield db  # Yield the session so FastAPI can use it
    finally:
        db.close()  # Make sure to close the session when done


app = FastAPI()
recommender = WorkoutRecommender()

@app.get("/")
def read_root():
    return {"message": "AI coach AI is working! Yoo-hoo!!"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/sync-user")
async def sync_user(
    user_data: schemas.UserSync,
    db: Session = Depends(get_db)
):
    # Check if user already exists
    user = db.query(models.User).filter(models.User.id == user_data.id).first()
    
    if user:
        # Update existing user
        for key, value in user_data.dict().items():
            setattr(user, key, value)
    else:
        # Create new user
        user = models.User(**user_data.dict())
        db.add(user)
    
    try:
        db.commit()
        return {"status": "success", "user_id": user.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/generate-workout")
async def generate_workout(
    request: schemas.WorkoutRequestFromFrontend,
    db: Session = Depends(get_db)
):
    try:
        print(f"Received request with fitness goal: {request.fitnessGoal}")
        
        # Initialize the recommender
        recommender = WorkoutRecommender()
        
        # Create user data dictionary for the recommender
        user_data = {
            'fitness_goal': request.fitnessGoal,
            'cycle_phase': request.menstrualCyclePhase,
            'fitness_level': getattr(request, 'fitness_level', 3),  # Use user data if available, default to 3
            'available_equipment': getattr(request, 'available_equipment', []),  # Use user data if available
            'user_metrics': {
                'fitness_level': getattr(request, 'fitness_level', 3),
                'experience_level': getattr(request, 'activity_level', 'intermediate'),
                'weight': getattr(request, 'weight', 70),
                'height': getattr(request, 'height', 170),
            }
        }

        if hasattr(request, 'medical_conditions') and request.medical_conditions:
            user_data['medical_conditions'] = request.medical_conditions
        
        # Add allergies if available
        if hasattr(request, 'allergies') and request.allergies:
            user_data['allergies'] = request.allergies
        
        # Generate workout using the recommender
        workout_result = recommender.generate_workout(user_data)
        
        # Transform the workout plan into frontend-friendly format
        workout_plan = []
        for exercise in workout_result.get('exercises', []):
            # Apply intensity modifications based on cycle phase if applicable
            if request.menstrualCyclePhase:
                exercise = utils.adjust_exercise_parameters(
                    exercise,
                    0.8 if request.menstrualCyclePhase == 'menstrual' else 1.0
                )
            
            # Calculate difficulty using the recommender's model
            difficulty = recommender.predict_exercise_difficulty(exercise)
            
            workout_plan.append({
                "name": exercise.get('name', ''),
                "sets": exercise.get('sets', 3),
                "reps": exercise.get('reps', 12),
                "duration": "30 mins",  # Default duration
                "intensity": f"Level {difficulty}/5",
                "type": exercise.get('type', 'strength'),
                "target_muscles": exercise.get('target_muscles', []),
                "equipment_needed": exercise.get('equipment_needed', [])
            })
        
        return {
            "workoutPlan": workout_plan,
            "difficulty": utils.calculate_workout_difficulty(
                user_data['user_metrics'],
                workout_result.get('exercises', [])
            )
        }
        
    except Exception as e:
        print(f"Error generating workout: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Failed to generate workout plan: {str(e)}"
        )

@app.post("/api/workout-feedback")
async def submit_feedback(
    feedback: schemas.WorkoutFeedback,
    db: Session = Depends(get_db)
):
    workout = db.query(models.WorkoutPlan).filter(
        models.WorkoutPlan.id == feedback.workout_id
    ).first()
    
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    workout.feedback = feedback.feedback
    workout.completed = True
    workout.difficulty_rating = feedback.difficulty_rating
    
    db.commit()
    return {"status": "success"}