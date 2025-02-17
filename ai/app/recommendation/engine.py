import numpy as np
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, List, Any, Union
from ..schemas import WorkoutRequestFromFrontend

class WorkoutRecommender:
    def __init__(self):
        # Load the exercise library and initialize the difficulty model
        self.exercise_library = self._load_exercise_library()
        self.difficulty_model = self._initialize_difficulty_model()

    def _load_exercise_library(self) -> Dict[str, List[Dict[str, Any]]]:
        """Load the exercise library with categorized exercises"""
        return {
            'strength': [
                {
                    'id': 1,
                    'name': 'Push-ups',
                    'difficulty': 2,
                    'target_muscles': ['chest', 'shoulders', 'triceps'],
                    'equipment_needed': [],
                    'suitable_for_phases': ['follicular', 'ovulation'],
                    'cardio_intensity': 2,
                    'strength_intensity': 3,
                    'type': 'strength'
                },
                {
                    'id': 2,
                    'name': 'Dumbbell Rows',
                    'difficulty': 2,
                    'target_muscles': ['back', 'biceps'],
                    'equipment_needed': ['dumbbells'],
                    'suitable_for_phases': ['follicular', 'ovulation', 'luteal'],
                    'cardio_intensity': 1,
                    'strength_intensity': 3,
                    'type': 'strength'
                },
                {
                    'id': 3,
                    'name': 'Goblet Squats',
                    'difficulty': 2,
                    'target_muscles': ['quads', 'glutes', 'core'],
                    'equipment_needed': ['kettlebell'],
                    'suitable_for_phases': ['follicular', 'ovulation'],
                    'cardio_intensity': 2,
                    'strength_intensity': 3,
                    'type': 'strength'
                },
                {
                    'id': 4,
                    'name': 'Bodyweight Lunges',
                    'difficulty': 2,
                    'target_muscles': ['quads', 'glutes', 'hamstrings'],
                    'equipment_needed': [],
                    'suitable_for_phases': ['follicular', 'ovulation', 'luteal', 'menstrual'],
                    'cardio_intensity': 2,
                    'strength_intensity': 2,
                    'type': 'strength'
                },
                {
                    'id': 5,
                    'name': 'Barbell Deadlifts',
                    'difficulty': 4,
                    'target_muscles': ['hamstrings', 'glutes', 'back', 'core'],
                    'equipment_needed': ['barbell'],
                    'suitable_for_phases': ['follicular', 'ovulation'],
                    'cardio_intensity': 2,
                    'strength_intensity': 5,
                    'type': 'strength'
                },
                {
                    'id': 6,
                    'name': 'Light Resistance Band Rows',
                    'difficulty': 1,
                    'target_muscles': ['back', 'shoulders'],
                    'equipment_needed': ['resistance band'],
                    'suitable_for_phases': ['menstrual', 'luteal'],
                    'cardio_intensity': 1,
                    'strength_intensity': 1,
                    'type': 'strength'
                }
            ],
            'cardio': [
                {
                    'id': 7,
                    'name': 'Jump Rope',
                    'difficulty': 3,
                    'target_muscles': ['calves', 'shoulders'],
                    'equipment_needed': ['jump rope'],
                    'suitable_for_phases': ['follicular', 'ovulation'],
                    'cardio_intensity': 4,
                    'strength_intensity': 2,
                    'type': 'cardio'
                },
                {
                    'id': 8,
                    'name': 'Walking',
                    'difficulty': 1,
                    'target_muscles': ['legs', 'core'],
                    'equipment_needed': [],
                    'suitable_for_phases': ['menstrual', 'luteal', 'follicular', 'ovulation'],
                    'cardio_intensity': 2,
                    'strength_intensity': 1,
                    'type': 'cardio'
                },
                {
                    'id': 9,
                    'name': 'HIIT Intervals',
                    'difficulty': 4,
                    'target_muscles': ['full body'],
                    'equipment_needed': [],
                    'suitable_for_phases': ['follicular', 'ovulation'],
                    'cardio_intensity': 5,
                    'strength_intensity': 3,
                    'type': 'cardio'
                },
                {
                    'id': 10,
                    'name': 'Cycling',
                    'difficulty': 3,
                    'target_muscles': ['quads', 'hamstrings', 'calves'],
                    'equipment_needed': ['bike'],
                    'suitable_for_phases': ['follicular', 'ovulation', 'luteal'],
                    'cardio_intensity': 3,
                    'strength_intensity': 2,
                    'type': 'cardio'
                },
                {
                    'id': 11,
                    'name': 'Swimming',
                    'difficulty': 3,
                    'target_muscles': ['full body'],
                    'equipment_needed': ['pool'],
                    'suitable_for_phases': ['menstrual', 'luteal', 'follicular', 'ovulation'],
                    'cardio_intensity': 3,
                    'strength_intensity': 2,
                    'type': 'cardio'
                }
            ],
            'flexibility': [
                {
                    'id': 12,
                    'name': 'Yoga Flow',
                    'difficulty': 2,
                    'target_muscles': ['full body'],
                    'equipment_needed': ['yoga mat'],
                    'suitable_for_phases': ['menstrual', 'luteal', 'follicular', 'ovulation'],
                    'cardio_intensity': 1,
                    'strength_intensity': 2,
                    'type': 'flexibility'
                },
                {
                    'id': 13,
                    'name': 'Static Stretching',
                    'difficulty': 1,
                    'target_muscles': ['full body'],
                    'equipment_needed': [],
                    'suitable_for_phases': ['menstrual', 'luteal', 'follicular', 'ovulation'],
                    'cardio_intensity': 1,
                    'strength_intensity': 1,
                    'type': 'flexibility'
                },
                {
                    'id': 14,
                    'name': 'Pilates',
                    'difficulty': 2,
                    'target_muscles': ['core', 'back', 'hips'],
                    'equipment_needed': ['yoga mat'],
                    'suitable_for_phases': ['menstrual', 'luteal', 'follicular', 'ovulation'],
                    'cardio_intensity': 2,
                    'strength_intensity': 2,
                    'type': 'flexibility'
                }
            ],
            'recovery': [
                {
                    'id': 15,
                    'name': 'Foam Rolling',
                    'difficulty': 1,
                    'target_muscles': ['full body'],
                    'equipment_needed': ['foam roller'],
                    'suitable_for_phases': ['menstrual', 'luteal', 'follicular', 'ovulation'],
                    'cardio_intensity': 1,
                    'strength_intensity': 1,
                    'type': 'recovery'
                },
                {
                    'id': 16,
                    'name': 'Light Walking',
                    'difficulty': 1,
                    'target_muscles': ['legs'],
                    'equipment_needed': [],
                    'suitable_for_phases': ['menstrual', 'luteal', 'follicular', 'ovulation'],
                    'cardio_intensity': 1,
                    'strength_intensity': 1,
                    'type': 'recovery'
                }
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
    
    def _create_base_plan(self, user_data: Dict) -> Dict:
        """Create a base workout plan based on user data."""
        # Map fitness goals to workout types
        goal_to_workout = {
            'Weight Loss': {'cardio': 0.6, 'strength': 0.3, 'flexibility': 0.1},
            'Muscle Gain': {'strength': 0.7, 'cardio': 0.2, 'flexibility': 0.1},
            'General Fitness': {'strength': 0.4, 'cardio': 0.4, 'flexibility': 0.2},
            'Toning': {'strength': 0.5, 'cardio': 0.3, 'flexibility': 0.2},
            'Endurance': {'cardio': 0.7, 'strength': 0.2, 'flexibility': 0.1}
        }
        
        # Get workout type distribution based on goal
        workout_split = goal_to_workout.get(
            user_data['fitness_goal'],
            {'strength': 0.4, 'cardio': 0.4, 'flexibility': 0.2}  # Default split
        )
        
        # Check if menstrual cycle tracking is enabled and adjust workout composition
        if user_data.get('cycle_phase'):
            workout_split = self._adjust_workout_split_for_phase(workout_split, user_data['cycle_phase'])
        
        exercises = []
        
        # Add exercises for each workout type
        for workout_type, proportion in workout_split.items():
            if workout_type in self.exercise_library and proportion > 0:
                count = int(5 * proportion)  # Base count of 5 exercises distributed by proportion
                if count > 0:
                    # Filter exercises by phase if available
                    available_exercises = self.exercise_library[workout_type]
                    if user_data.get('cycle_phase'):
                        available_exercises = [
                            ex for ex in available_exercises 
                            if user_data['cycle_phase'] in ex.get('suitable_for_phases', [])
                        ]
                    
                    # If no exercises are suitable for this phase, use unfiltered exercises
                    if not available_exercises and workout_type in self.exercise_library:
                        available_exercises = self.exercise_library[workout_type]
                    
                    if available_exercises:
                        selected = list(np.random.choice(
                            available_exercises,
                            size=min(count, len(available_exercises)),
                            replace=False
                        ))
                        exercises.extend(selected)
        
        # Add exercise parameters
        for exercise in exercises:
            if 'sets' not in exercise:
                exercise['sets'] = 3 if exercise.get('type') == 'strength' else 1
            if 'reps' not in exercise:
                if exercise.get('type') == 'strength':
                    exercise['reps'] = 12
                elif exercise.get('type') == 'cardio':
                    exercise['reps'] = '30 seconds'
                elif exercise.get('type') in ['flexibility', 'recovery']:
                    exercise['reps'] = '45 seconds'
        
        return {
            'exercises': exercises,
            'total_duration': 45,  # minutes
            'difficulty': np.mean([ex.get('difficulty', 3) for ex in exercises]) if exercises else 3
        }
    
    def _adjust_workout_split_for_phase(self, workout_split: Dict[str, float], phase: str) -> Dict[str, float]:
        """Adjust workout type proportions based on menstrual cycle phase"""
        phase_adjustments = {
            'menstrual': {
                'strength': 0.6,  # Reduce strength
                'cardio': 0.5,    # Reduce cardio
                'flexibility': 1.5,  # Increase flexibility
                'recovery': 2.0   # Add recovery
            },
            'follicular': {
                'strength': 1.2,  # Increase strength
                'cardio': 1.1,    # Slightly increase cardio
                'flexibility': 0.8,  # Slightly reduce flexibility
                'recovery': 0.7   # Reduce recovery
            },
            'ovulation': {
                'strength': 1.3,  # Maximize strength
                'cardio': 1.2,    # Increase cardio
                'flexibility': 0.8,  # Reduce flexibility
                'recovery': 0.6   # Minimize recovery
            },
            'luteal': {
                'strength': 0.8,  # Reduce strength
                'cardio': 0.7,    # Reduce cardio
                'flexibility': 1.3,  # Increase flexibility
                'recovery': 1.5   # Increase recovery
            }
        }
        
        # Get adjustment factors for the current phase
        adj = phase_adjustments.get(phase, {
            'strength': 1.0,
            'cardio': 1.0,
            'flexibility': 1.0,
            'recovery': 1.0
        })
        
        # Apply adjustments
        adjusted_split = {}
        for workout_type, proportion in workout_split.items():
            adjusted_split[workout_type] = proportion * adj.get(workout_type, 1.0)
        
        # Add recovery if not present for menstrual and luteal phases
        if phase in ['menstrual', 'luteal'] and 'recovery' not in adjusted_split:
            adjusted_split['recovery'] = 0.2
        
        # Normalize to ensure total equals 1
        total = sum(adjusted_split.values())
        if total > 0:
            for workout_type in adjusted_split:
                adjusted_split[workout_type] /= total
        
        return adjusted_split
    
    def _finalize_plan(self, plan: Dict, user_data: Dict) -> Dict:
        """Finalize the workout plan with user-specific adjustments."""
        
        # Adjust difficulty based on fitness level
        fitness_level = user_data.get('fitness_level', 3)
        difficulty_modifier = (fitness_level - 3) * 0.2 + 1  # ±20% per level difference from 3
        
        for exercise in plan['exercises']:
            # Adjust sets and reps based on fitness level
            if exercise.get('type') == 'strength':
                exercise['sets'] = max(2, round(exercise.get('sets', 3) * difficulty_modifier))
                exercise['reps'] = max(5, round(exercise.get('reps', 12) * difficulty_modifier))
            elif exercise.get('type') == 'cardio' and isinstance(exercise.get('reps'), int):
                exercise['reps'] = max(15, round(exercise.get('reps', 30) * difficulty_modifier))
        
        # Apply cycle-specific intensity adjustments if applicable
        if user_data.get('cycle_phase'):
            plan = self._adjust_intensity_for_cycle(plan, user_data['cycle_phase'])
        
        # Add custom recommendations based on phase
        if user_data.get('cycle_phase'):
            plan['phase_recommendations'] = self._get_phase_recommendations(user_data['cycle_phase'])
        
        return plan
    
    def _adjust_intensity_for_cycle(self, plan: Dict, phase: str) -> Dict:
        """Apply intensity adjustments based on menstrual cycle phase"""
        phase_intensity_adjustments = {
            'menstrual': {
                'sets_modifier': 0.8,
                'reps_modifier': 0.9,
                'cardio_duration_modifier': 0.8,
                'intensity_advice': 'Keep intensity lower to accommodate possible discomfort. Focus on movement rather than intensity.'
            },
            'follicular': {
                'sets_modifier': 1.0,
                'reps_modifier': 1.0,
                'cardio_duration_modifier': 1.0,
                'intensity_advice': 'You can gradually increase intensity throughout this phase as energy levels rise.'
            },
            'ovulation': {
                'sets_modifier': 1.2,
                'reps_modifier': 1.1,
                'cardio_duration_modifier': 1.2,
                'intensity_advice': 'Energy levels are likely at their peak. Take advantage with higher intensity workouts if feeling good.'
            },
            'luteal': {
                'sets_modifier': 0.9,
                'reps_modifier': 0.9,
                'cardio_duration_modifier': 0.9,
                'intensity_advice': 'As this phase progresses, you may want to gradually reduce intensity. Listen to your body.'
            }
        }
        
        # Get adjustment factors
        adj = phase_intensity_adjustments.get(phase, {
            'sets_modifier': 1.0,
            'reps_modifier': 1.0,
            'cardio_duration_modifier': 1.0,
            'intensity_advice': 'Maintain your normal intensity level.'
        })
        
        # Apply adjustments to each exercise
        for exercise in plan['exercises']:
            if exercise.get('type') == 'strength':
                exercise['sets'] = max(1, round(exercise.get('sets', 3) * adj['sets_modifier']))
                if isinstance(exercise.get('reps'), int):
                    exercise['reps'] = max(5, round(exercise.get('reps', 12) * adj['reps_modifier']))
            elif exercise.get('type') == 'cardio' and isinstance(exercise.get('reps'), str) and 'seconds' in exercise.get('reps', ''):
                # Extract seconds, adjust, and reconstruct string
                try:
                    seconds = int(exercise['reps'].split()[0])
                    adjusted_seconds = max(15, round(seconds * adj['cardio_duration_modifier']))
                    exercise['reps'] = f"{adjusted_seconds} seconds"
                except (ValueError, IndexError):
                    pass  # Keep original if parsing fails
        
        # Add intensity advice to the plan
        plan['intensity_advice'] = adj['intensity_advice']
        
        return plan
    
    def _get_phase_recommendations(self, phase: str) -> Dict[str, str]:
        """Get phase-specific workout and nutrition recommendations"""
        recommendations = {
            'menstrual': {
                'workout': 'Focus on gentle movement like walking, swimming, light yoga, and mobility work. Consider reducing workout duration and avoid high-intensity training.',
                'nutrition': 'Consider increasing iron-rich foods like leafy greens and lean meats. Stay well-hydrated and include anti-inflammatory foods like berries, fatty fish, and turmeric.',
                'recovery': 'Prioritize sleep and rest. Heat packs can help manage cramps. Gentle stretching may alleviate discomfort.'
            },
            'follicular': {
                'workout': 'Your energy is building, making this a good time to start adding intensity. Focus on progressive strength training and moderate cardio.',
                'nutrition': 'Support muscle building with adequate protein. Include complex carbs for sustained energy during longer workouts.',
                'recovery': 'Standard recovery protocols work well here. Focus on good sleep habits and adequate hydration.'
            },
            'ovulation': {
                'workout': 'Energy levels are typically highest now. Take advantage with more challenging workouts, HIIT, and heavier weights if you are feeling good.',
                'nutrition': 'Support higher intensity workouts with adequate carbohydrates. Stay well-hydrated, especially during intense sessions.',
                'recovery': 'With increased workout intensity, pay attention to recovery. Consider adding foam rolling and targeted stretching.'
            },
            'luteal': {
                'workout': 'As progesterone rises, you may notice decreased energy. Consider reducing intensity, especially in the later part of this phase. Focus on steady-state cardio and lighter weights with higher reps.',
                'nutrition': 'You may experience increased appetite. Focus on fiber-rich foods and complex carbs to help manage cravings. Magnesium-rich foods like nuts and dark chocolate may help with symptoms.',
                'recovery': 'You might need extra recovery time. Listen to your body and do not push through fatigue. Restorative yoga and extra sleep can be beneficial.'
            }
        }
        
        return recommendations.get(phase, {
            'workout': 'Follow your regular workout routine, adjusting based on how you feel each day.',
            'nutrition': 'Focus on balanced nutrition with adequate protein, complex carbohydrates, and healthy fats.',
            'recovery': 'Prioritize consistent sleep and recovery practices.'
        })

    def generate_workout(self, user_data: Dict) -> Dict:
        """Generate a personalized workout plan based on user data and menstrual cycle if tracked"""
        base_plan = self._create_base_plan(user_data)
        finalized_plan = self._finalize_plan(base_plan, user_data)
        
        # Add workout summary
        if finalized_plan['exercises']:
            workout_types = {}
            for ex in finalized_plan['exercises']:
                ex_type = ex.get('type', 'other')
                if ex_type not in workout_types:
                    workout_types[ex_type] = 0
                workout_types[ex_type] += 1
            
            finalized_plan['summary'] = {
                'exercise_count': len(finalized_plan['exercises']),
                'average_difficulty': np.mean([ex.get('difficulty', 3) for ex in finalized_plan['exercises']]),
                'workout_composition': workout_types,
                'menstrual_phase': user_data.get('cycle_phase', 'not_tracked')
            }
        
        return finalized_plan

    def predict_exercise_difficulty(self, exercise: Dict) -> int:
        """
        Predict the difficulty level of a given exercise based on its features.
        
        Args:
            exercise (Dict): Exercise dictionary containing exercise details
        
        Returns:
            int: Predicted difficulty level (1-5)
        """
        # Extract features from exercise dictionary
        features = self.get_exercise_features(exercise)
        
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
            len(exercise.get('target_muscles', [])),
            len(exercise.get('equipment_needed', [])),
            1 if len(exercise.get('target_muscles', [])) > 2 else 0,
            exercise.get('cardio_intensity', 1),
            exercise.get('strength_intensity', 1)
        ]
    
    def filter_exercises_by_phase(self, phase: str) -> Dict[str, List[Dict]]:
        """
        Filter the exercise library to return only exercises suitable for a specific menstrual cycle phase.
        
        Args:
            phase (str): The menstrual cycle phase ('menstrual', 'follicular', 'ovulation', 'luteal')
        
        Returns:
            Dict[str, List[Dict]]: Dictionary of exercise categories with filtered exercises
        """
        if not phase:
            return self.exercise_library
        
        filtered_library = {}
        for category, exercises in self.exercise_library.items():
            filtered_exercises = [
                ex for ex in exercises 
                if phase in ex.get('suitable_for_phases', []) or not ex.get('suitable_for_phases')
            ]
            if filtered_exercises:
                filtered_library[category] = filtered_exercises
        
        return filtered_library

    def get_phase_specific_advice(self, phase: str, exercise_type: str = None) -> str:
        """
        Get specific advice for exercising during a particular menstrual cycle phase.
        
        Args:
            phase (str): The menstrual cycle phase
            exercise_type (str, optional): Type of exercise for more specific advice
        
        Returns:
            str: Advice specific to the phase and exercise type
        """
        general_advice = {
            'menstrual': "During your period, focus on gentle movement. Listen to your body and reduce intensity if experiencing cramps or discomfort. This is a good time for walking, light yoga, and mobility work.",
            'follicular': "As estrogen rises after your period, energy levels typically increase. This is a good time to gradually increase workout intensity and try new challenging exercises.",
            'ovulation': "Around ovulation, estrogen peaks and many women experience peak strength and energy. Take advantage by scheduling more intense workouts if you feel good.",
            'luteal': "As progesterone rises, you may notice decreased energy and increased body temperature. Consider more moderate workouts and extra recovery time, especially in the later part of this phase."
        }
        
        exercise_specific_advice = {
            'strength': {
                'menstrual': "Reduce weight and increase reps. Focus on form rather than pushing for personal records.",
                'follicular': "Progressive overload works well in this phase. Track your lifts and aim for steady improvement.",
                'ovulation': "You may feel stronger now. This can be a good time to test your strength levels or try heavier weights if you feel good.",
                'luteal': "Maintain rather than push limits. Consider using lighter weights with higher reps."
            },
            'cardio': {
                'menstrual': "Lower intensity, steady-state cardio is often better tolerated. Consider reducing duration by 20-30%.",
                'follicular': "You can gradually increase intensity. This is a good time to introduce interval training.",
                'ovulation': "Your body may handle high-intensity work better now. HIIT and sprint work can be effective if you're feeling energetic.",
                'luteal': "Your body temperature is elevated, making intense cardio feel harder. Reduce intensity and stay extra hydrated."
            },
            'flexibility': {
                'menstrual': "Gentle stretching can help alleviate cramps. Avoid deep stretching if you feel additional discomfort.",
                'follicular': "Regular stretching routines work well here. Your body may feel more responsive to flexibility training.",
                'ovulation': "Your joints may be slightly more flexible due to hormonal changes. Be careful not to overstretch.",
                'luteal': "Focus on restorative yoga and gentle stretching, especially if experiencing PMS symptoms."
            }
        }
        
        advice = general_advice.get(phase, "Listen to your body and adjust your workout based on how you feel.")
        
        if exercise_type and exercise_type in exercise_specific_advice:
            specific_advice = exercise_specific_advice[exercise_type].get(phase, "")
            if specific_advice:
                advice += f" {specific_advice}"
        
        return advice