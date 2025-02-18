from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Boolean, ARRAY, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=True)
    fitness_goal = Column(String)
    fitness_level = Column(Integer)  # 1-5 scale
    available_equipment = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    metrics = relationship("UserMetrics", back_populates="user")
    workout_plans = relationship("WorkoutPlan", back_populates="user")
    cycle_logs = relationship("MenstrualCycleLog", back_populates="user")

class UserMetrics(Base):
    __tablename__ = "user_metrics"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    weight = Column(Float)
    height = Column(Float)
    body_fat = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="metrics")

class WorkoutPlan(Base):
    __tablename__ = "workout_plans"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercises = Column(JSON)  # List of exercise details
    difficulty = Column(Float)
    completed = Column(Boolean, default=False)
    feedback = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="workout_plans")

class MenstrualCycleLog(Base):
    __tablename__ = "menstrual_cycle_logs"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(DateTime, nullable=False)
    cycle_length = Column(Integer, default=28)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="cycle_logs")

class Exercise(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    type = Column(String)  # strength, cardio, flexibility
    difficulty = Column(Integer)  # 1-5 scale
    target_muscles = Column(JSON)
    required_equipment = Column(JSON)
    default_sets = Column(Integer)
    default_reps = Column(Integer)
    form_tips = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)