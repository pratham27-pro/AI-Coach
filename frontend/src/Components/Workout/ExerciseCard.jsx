import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight } from 'lucide-react';

const ExerciseCard = ({ exercise, onStartExercise }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {exercise.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm">Sets: {exercise.sets}</p>
            <p className="text-sm">Reps: {exercise.reps}</p>
            <p className="mt-2">{exercise.description}</p>
          </div>
          <Button 
            onClick={() => onStartExercise(exercise)}
            className="w-full"
          >
            Start Exercise
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;