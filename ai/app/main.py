from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from . import models, schemas
from .recommendation.engine import WorkoutRecommender

app = FastAPI()
recommender = WorkoutRecommender()

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