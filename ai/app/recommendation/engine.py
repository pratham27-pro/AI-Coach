import numpy as np
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, List

class WorkoutRecommender:
    def __init__(self):
        # Load the exercise library and initialize the difficulty model
        self.exercise_library = self._load_exercise_library()
        self.difficulty_model = self._initialize_difficulty_model()

    def _load_exercise_library(self) -> Dict:
        # In production, load from the database
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

    def _initialize_difficulty_model(self) -> RandomForestClassifier:
        """
        Initialize and train a RandomForestClassifier to predict exercise difficulty.
        Returns a trained model that can predict difficulty levels (1-5) based on exercise features.
        """
        # In production, this training data would come from a database
        # Here we create sample training data
        sample_exercises = [
            # Format: [muscle_groups_count, equipment_count, compound_movement(0/1), cardio_intensity, strength_intensity]
            # Easy exercises (difficulty 1)
            [1, 0, 0, 1, 1],  # Walking
            [2, 0, 0, 1, 2],  # Body weight squats
            [1, 0, 0, 2, 1],  # Arm circles
            
            # Moderate exercises (difficulty 2)
            [2, 1, 0, 2, 2],  # Dumbbell curls
            [3, 0, 1, 2, 2],  # Push-ups
            [2, 1, 0, 3, 2],  # Resistance band rows
            
            # Intermediate exercises (difficulty 3)
            [3, 1, 1, 3, 3],  # Kettlebell swings
            [4, 2, 1, 2, 3],  # Barbell bench press
            [3, 1, 1, 3, 3],  # Dumbbell lunges
            
            # Advanced exercises (difficulty 4)
            [4, 2, 1, 4, 4],  # Clean and press
            [5, 2, 1, 3, 4],  # Barbell deadlifts
            [4, 1, 1, 4, 4],  # Plyometric push-ups
            
            # Expert exercises (difficulty 5)
            [5, 2, 1, 5, 5],  # Olympic snatch
            [5, 2, 1, 4, 5],  # Heavy compound supersets
            [4, 1, 1, 5, 5],  # Muscle-ups
        ]
        
        # Create corresponding difficulty labels (1-5)
        difficulty_labels = [
            1, 1, 1,  # Easy
            2, 2, 2,  # Moderate
            3, 3, 3,  # Intermediate
            4, 4, 4,  # Advanced
            5, 5, 5   # Expert
        ]
        
        # Convert to numpy arrays
        X = np.array(sample_exercises)
        y = np.array(difficulty_labels)
        
        # Initialize and train the model
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=5,
            min_samples_split=4,
            min_samples_leaf=2,
            random_state=42
        )
        
        model.fit(X, y)
        return model

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
            'luteal': {'intensity': 0.8, 'focus': ['moderate_cardio', 'yoga']},
        }
        
        adj = phase_adjustments.get(phase, {'intensity': 1.0, 'focus': []})
        
        # Adjust exercise selection and parameters
        for exercise in plan['exercises']:
            exercise['intensity'] *= adj['intensity']
            if any(focus in exercise['type'] for focus in adj['focus']):
                exercise['sets'] = max(2, round(exercise['sets'] * adj['intensity']))
        
        return plan

    def predict_exercise_difficulty(self, exercise: Dict) -> int:
        """
        Predict the difficulty level of a given exercise based on its features.
        
        Args:
            exercise (Dict): Exercise dictionary containing exercise details
        
        Returns:
            int: Predicted difficulty level (1-5)
        """
        # Extract features from exercise dictionary
        features = [
            len(exercise['target_muscles']),
            len(exercise['equipment_needed']),
            1 if len(exercise['target_muscles']) > 2 else 0,  # compound movement
            exercise.get('cardio_intensity', 1),
            exercise.get('strength_intensity', 1)
        ]
        
        # Reshape features for prediction
        X = np.array(features).reshape(1, -1)
        
        # Predict difficulty
        predicted_difficulty = self.difficulty_model.predict(X)[0]
        
        return int(predicted_difficulty)

    def get_exercise_features(self, exercise: Dict) -> List[int]:
        """
        Extract numerical features from exercise dictionary for difficulty prediction.
        
        Args:
            exercise (Dict): Exercise dictionary containing exercise details
        
        Returns:
            List[int]: List of numerical features for the exercise
        """
        return [
            len(exercise['target_muscles']),
            len(exercise['equipment_needed']),
            1 if len(exercise['target_muscles']) > 2 else 0,
            exercise.get('cardio_intensity', 1),
            exercise.get('strength_intensity', 1)
        ]
