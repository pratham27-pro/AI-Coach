import numpy as np
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, List

class WorkoutRecommender:
    def __init__(self):
        self.exercise_library = self._load_exercise_library()
        self.difficulty_model = self._initialize_difficulty_model()
    
    def _load_exercise_library(self) -> Dict:
        # In production, load from database
        return {
            'strength': [
                {
                    'id': 1,
                    'name': 'Push-ups',
                    'difficulty': 2,
                    'target_muscles': ['chest', 'shoulders', 'triceps'],
                    'equipment_needed': []
                },
                # More exercises...
            ],
            'cardio': [
                {
                    'id': 2,
                    'name': 'Jump Rope',
                    'difficulty': 3,
                    'target_muscles': ['calves', 'shoulders'],
                    'equipment_needed': ['jump rope']
                },
                # More exercises...
            ]
        }
    
    def generate_workout(self, user_data: Dict) -> Dict:
        base_plan = self._create_base_plan(user_data)
        
        if user_data.get('cycle_phase'):
            base_plan = self._adjust_for_cycle(base_plan, user_data['cycle_phase'])
        
        return self._finalize_plan(base_plan, user_data)
    
    def _adjust_for_cycle(self, plan: Dict, phase: str) -> Dict:
        phase_adjustments = {
            'menstrual': {'intensity': 0.7, 'focus': ['flexibility', 'light_cardio']},
            'follicular': {'intensity': 1.0, 'focus': ['strength', 'cardio']},
            'ovulation': {'intensity': 1.2, 'focus': ['hiit', 'strength']},
            'luteal': {'intensity': 0.8, 'focus': ['moderate_cardio', 'yoga']}
        }
        
        adj = phase_adjustments.get(phase, {'intensity': 1.0, 'focus': []})
        
        # Adjust exercise selection and parameters
        for exercise in plan['exercises']:
            exercise['intensity'] *= adj['intensity']
            if any(focus in exercise['type'] for focus in adj['focus']):
                exercise['sets'] = max(2, round(exercise['sets'] * adj['intensity']))
        
        return plan