from typing import Dict, List
import numpy as np
from datetime import datetime, timedelta

def calculate_workout_difficulty(user_metrics: Dict, exercise_list: List[Dict]) -> float:
    """Calculate overall workout difficulty based on exercises and user metrics."""
    base_difficulty = np.mean([exercise['difficulty'] for exercise in exercise_list])
    fitness_modifier = user_metrics['fitness_level'] / 5  # Assuming fitness_level is 1-5
    return base_difficulty * (1 / fitness_modifier)

def get_cycle_phase(last_period_date: datetime, cycle_length: int = 28) -> str:
    """Calculate current menstrual cycle phase based on last period date."""
    today = datetime.now()
    days_since_period = (today - last_period_date).days % cycle_length
    
    if days_since_period < 5:
        return "menstrual"
    elif days_since_period < 14:
        return "follicular"
    elif days_since_period < 17:
        return "ovulation"
    else:
        return "luteal"

def adjust_exercise_parameters(exercise: Dict, intensity_modifier: float) -> Dict:
    """Adjust exercise parameters based on intensity modifier."""
    adjusted = exercise.copy()
    adjusted['sets'] = max(1, round(exercise['sets'] * intensity_modifier))
    adjusted['reps'] = max(1, round(exercise['reps'] * intensity_modifier))
    return adjusted