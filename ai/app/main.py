from fastapi import FastAPI, HTTPException, Depends, Request
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
import logging

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:happy@localhost:5432/postgres")

print(SQLALCHEMY_DATABASE_URL) 

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the .env file")

# Create the SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a sessionmaker factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# models.Base.metadata.create_all(bind=engine)

def init_db():
    try:
        # Create tables
        models.Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise

# Initialize the database
init_db()

# Base class for the models
Base = declarative_base()

def get_db():
    """Create a new SQLAlchemy session."""
    db = SessionLocal()
    try:
        yield db  # Yield the session so FastAPI can use it
    finally:
        db.close()  # Make sure to close the session when done

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
recommender = WorkoutRecommender()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI coach AI is working! Yoo-hoo!!"}

@app.post("/api/sync-user")
async def sync_user(
    request: Request,
    user_data: schemas.UserSync,
    db: Session = Depends(get_db)
):
    logger.info(f"Received sync-user request: {user_data.dict()}")

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
        logger.error(f"Error in sync_user: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def transform_fitness_level(level: str) -> int:
    levels = {
        'Beginner': 1,
        'Intermediate': 2,
        'Advanced': 3
    }
    return levels.get(level, 1)

def transform_activity_level(level: str) -> str:
    levels = {
        'Sedentary (Little to no exercise)': 'beginner',
        'Lightly Active (1-3 workouts per week)': 'intermediate',
        'Moderately Active (4-5 workouts per week)': 'advanced',
        'Very Active (Daily intense workouts)': 'expert'
    }
    return levels.get(level, 'intermediate')

@app.post("/api/generate-workout")
async def generate_workout(
    request: schemas.WorkoutRequestFromFrontend,
    db: Session = Depends(get_db)
):
    try:
        print(f"Received request with fitness goal: {request.fitnessGoal}")
        
        backend_request = request.to_backend_schema()

        # Initialize the recommender
        recommender = WorkoutRecommender()
        
        # Create user data dictionary for the recommender
        user_data = {
            'fitness_goal': request.fitnessGoal,
            'cycle_phase': request.menstrualCyclePhase,
            'fitness_level': transform_fitness_level(request.fitnessLevel),
            'available_equipment': [],
            'user_metrics': {
                'fitness_level': transform_fitness_level(request.fitnessLevel),
                'experience_level': transform_activity_level(request.activityLevel),
                'weight': float(request.weight) if request.weight else 70,
                'height': float(request.height) if request.height else 170,
            }
        }

        if request.medicalConditions:
            user_data['medical_conditions'] = request.medicalConditions
        
        if request.allergies:
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

def reset_database():
    print("Dropping all tables...")
    models.Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    models.Base.metadata.create_all(bind=engine)
    print("Database reset complete")

# reset_database() 