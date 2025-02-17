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

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:happy@localhost:5432/postgres")

print(SQLALCHEMY_DATABASE_URL)  # Add this line to debug the URL

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
    allow_origins=["http://localhost:5173"],
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
    request: schemas.WorkoutRequest,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    workout_plan = recommender.generate_workout({
        'user_id': user.id,
        'fitness_goal': user.fitness_goal,
        'cycle_phase': request.cycle_phase,
        'fitness_level': user.fitness_level,
        'equipment': user.available_equipment
    })
    
    # Save workout plan to database
    db_plan = models.WorkoutPlan(
        user_id=user.id,
        exercises=workout_plan['exercises'],
        difficulty=workout_plan['difficulty']
    )
    db.add(db_plan)
    db.commit()
    
    return workout_plan

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