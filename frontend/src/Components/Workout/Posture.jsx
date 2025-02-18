import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { useParams, useNavigate } from 'react-router-dom';

const exerciseFormChecks = {
  // Strength Exercises
  'push-ups': {
    name: 'Push-ups',
    type: 'strength',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip', 'left_knee'],
    targetReps: 10,
    checks: [
      {
        name: 'elbowAngle',
        points: ['left_shoulder', 'left_elbow', 'left_wrist'],
        range: { min: 85, max: 95 },
        message: "Keep elbows at 90 degrees"
      },
      {
        name: 'backAngle',
        points: ['left_shoulder', 'left_hip', 'left_knee'],
        range: { min: 160, max: 180 },
        message: "Keep your back straight"
      }
    ]
  },
  'dumbbell-rows': {
    name: 'Dumbbell Rows',
    type: 'strength',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip'],
    targetReps: 12,
    checks: [
      {
        name: 'backAngle',
        points: ['left_shoulder', 'left_hip', 'left_knee'],
        range: { min: 150, max: 170 },
        message: "Keep your back straight, slight bend is ok"
      },
      {
        name: 'elbowTuck',
        points: ['left_shoulder', 'left_elbow', 'left_wrist'],
        range: { min: 0, max: 45 },
        message: "Keep your elbow close to your body"
      }
    ]
  },
  'goblet-squats': {
    name: 'Goblet Squats',
    type: 'strength',
    keypoints: ['left_hip', 'left_knee', 'left_ankle', 'left_shoulder'],
    targetReps: 12,
    checks: [
      {
        name: 'kneeAngle',
        points: ['left_hip', 'left_knee', 'left_ankle'],
        range: { min: 85, max: 95 },
        message: "Lower until thighs are parallel to ground"
      },
      {
        name: 'backAngle',
        points: ['left_shoulder', 'left_hip', 'left_knee'],
        range: { min: 150, max: 180 },
        message: "Keep your back straight, chest up"
      }
    ]
  },
  'bodyweight-lunges': {
    name: 'Bodyweight Lunges',
    type: 'strength',
    keypoints: ['left_hip', 'left_knee', 'left_ankle', 'right_hip', 'right_knee', 'right_ankle'],
    targetReps: 12,
    checks: [
      {
        name: 'frontKneeAngle',
        points: ['left_hip', 'left_knee', 'left_ankle'],
        range: { min: 85, max: 95 },
        message: "Front knee should be at 90 degrees"
      },
      {
        name: 'backKneeAngle',
        points: ['right_hip', 'right_knee', 'right_ankle'],
        range: { min: 85, max: 95 },
        message: "Back knee should be at 90 degrees"
      }
    ]
  },
  'barbell-deadlifts': {
    name: 'Barbell Deadlifts',
    type: 'strength',
    keypoints: ['left_shoulder', 'left_hip', 'left_knee', 'left_ankle'],
    targetReps: 8,
    checks: [
      {
        name: 'backAngle',
        points: ['left_shoulder', 'left_hip', 'left_knee'],
        range: { min: 160, max: 180 },
        message: "Keep your back straight throughout the movement"
      },
      {
        name: 'hipHinge',
        points: ['left_shoulder', 'left_hip', 'left_ankle'],
        range: { min: 130, max: 160 },
        message: "Hinge at your hips, push them back"
      }
    ]
  },
  'resistance-band-rows': {
    name: 'Light Resistance Band Rows',
    type: 'strength',
    keypoints: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_hip'],
    targetReps: 15,
    checks: [
      {
        name: 'elbowAngle',
        points: ['left_shoulder', 'left_elbow', 'left_wrist'],
        range: { min: 85, max: 95 },
        message: "Pull elbows back to 90 degrees"
      },
      {
        name: 'shoulderAlignment',
        points: ['left_shoulder', 'right_shoulder'],
        range: { min: 170, max: 180 },
        message: "Keep shoulders level and back"
      }
    ]
  },

  // Cardio Exercises
  'jump-rope': {
    name: 'Jump Rope',
    type: 'cardio',
    keypoints: ['left_ankle', 'left_knee', 'left_hip', 'nose'],
    targetDuration: 60, // in seconds
    checks: [
      {
        name: 'jumpHeight',
        points: ['left_ankle', 'left_knee'],
        range: { min: 10, max: 20 },
        message: "Small, controlled jumps"
      },
      {
        name: 'posture',
        points: ['nose', 'left_hip', 'left_ankle'],
        range: { min: 170, max: 180 },
        message: "Keep your body upright"
      }
    ]
  },
  'hiit-intervals': {
    name: 'HIIT Intervals',
    type: 'cardio',
    keypoints: ['left_ankle', 'left_knee', 'left_hip', 'left_shoulder', 'nose'],
    targetDuration: 30, // in seconds per interval
    checks: [
      {
        name: 'fullBodyAlignment',
        points: ['nose', 'left_shoulder', 'left_hip', 'left_knee', 'left_ankle'],
        range: { min: 160, max: 180 },
        message: "Maintain proper form during high-intensity movements"
      }
    ]
  },

  // Flexibility Exercises
  'yoga-flow': {
    name: 'Yoga Flow',
    type: 'flexibility',
    keypoints: ['left_ankle', 'left_knee', 'left_hip', 'left_shoulder', 'left_wrist', 'nose'],
    targetDuration: 300, // 5 minutes
    checks: [
      {
        name: 'alignment',
        points: ['left_shoulder', 'left_hip', 'left_ankle'],
        range: { min: 160, max: 180 },
        message: "Keep your body aligned in poses"
      },
      {
        name: 'balance',
        points: ['nose', 'left_hip', 'left_ankle'],
        range: { min: 170, max: 180 },
        message: "Maintain balance and stability"
      }
    ]
  },
  'static-stretching': {
    name: 'Static Stretching',
    type: 'flexibility',
    keypoints: ['left_ankle', 'left_knee', 'left_hip', 'left_shoulder'],
    targetDuration: 30, // 30 seconds per stretch
    checks: [
      {
        name: 'stretchAlignment',
        points: ['left_shoulder', 'left_hip', 'left_knee'],
        range: { min: 150, max: 180 },
        message: "Maintain proper alignment during stretches"
      }
    ]
  },
  'pilates': {
    name: 'Pilates',
    type: 'flexibility',
    keypoints: ['left_ankle', 'left_knee', 'left_hip', 'left_shoulder', 'nose'],
    targetDuration: 300, // 5 minutes
    checks: [
      {
        name: 'coreAlignment',
        points: ['left_shoulder', 'left_hip', 'left_knee'],
        range: { min: 160, max: 180 },
        message: "Keep your core engaged and spine neutral"
      }
    ]
  }
};

const calculateAngle = (a, b, c) => {
  if (!a || !b || !c) return null;
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
};

const PoseDetection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [goodFormStreak, setGoodFormStreak] = useState(0);

  useEffect(() => {
    const exerciseId = id.toLowerCase().replace(/\s+/g, '-');
    const currentExercise = exerciseFormChecks[exerciseId];
    if (currentExercise) {
      setExercise(currentExercise);
    } else {
      setFeedback({
        message: "Exercise not found or pose detection not supported for this exercise",
        type: 'error'
      });
    }
  }, [id]);

  useEffect(() => {
    const initPoseDetection = async () => {
      await tf.ready();
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        {
          runtime: 'tfjs',
          modelType: 'full'
        }
      );
      setDetector(detector);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setFeedback({
          message: "Camera access denied. Please check permissions.",
          type: 'error'
        });
      }
    };

    initPoseDetection();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkForm = (pose, exercise) => {
    const keypoints = pose.keypoints;
    const keypointMap = Object.fromEntries(keypoints.map(kp => [kp.name, kp]));

    // Check if all required keypoints are visible
    const missingKeypoints = exercise.keypoints.filter(
      kp => !keypointMap[kp] || keypointMap[kp].score < 0.5
    );

    if (missingKeypoints.length > 0) {
      return {
        message: "Please ensure your full body is visible",
        type: 'warning',
        isGoodForm: false
      };
    }

    const feedbackMessages = [];

    if (exercise.targetDuration) {
      const timeRemaining = exercise.targetDuration - elapsedTime;
      if (timeRemaining <= 0) {
        return {
          message: "Exercise completed! Great job!",
          type: 'success',
          isGoodForm: true,
          completed: true
        };
      }
    }

    for (const check of exercise.checks) {
      const points = check.points.map(p => keypointMap[p]);
      const angle = calculateAngle(...points);

      if (angle === null) continue;

      if (angle < check.range.min || angle > check.range.max) {
        feedbackMessages.push(check.message);
      }
    }

    return {
      message: feedbackMessages.length > 0 ? feedbackMessages.join(". ") : "Good form! Keep going!",
      type: feedbackMessages.length > 0 ? 'warning' : 'success',
      isGoodForm: feedbackMessages.length === 0
    };
  };

  const detectPose = async () => {
    if (!detector || !videoRef.current || !isRecording || !exercise) return;

    try {
      const poses = await detector.estimatePoses(videoRef.current);
      
      if (poses.length > 0) {
        const formCheck = checkForm(poses[0], exercise);
        setFeedback(formCheck);

        if (formCheck.isGoodForm) {
          setGoodFormStreak(prev => prev + 1);
          if (goodFormStreak >= 30) { // About 1 second of good form
            setRepCount(prev => prev + 1);
            setGoodFormStreak(0);
          }
        } else {
          setGoodFormStreak(0);
        }

        if (repCount >= exercise.targetReps) {
          setIsRecording(false);
          setFeedback({
            message: "Great job! Exercise completed!",
            type: 'success'
          });
          setTimeout(() => navigate('/workout'), 3000);
        }
      }

      if (isRecording) {
        requestAnimationFrame(detectPose);
      }
    } catch (error) {
      console.error('Pose detection error:', error);
      setFeedback({
        message: "Error during pose detection",
        type: 'error'
      });
    }
  };

  useEffect(() => {
    if (isRecording) {
      detectPose();
    }
  }, [isRecording, detector, exercise]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {exercise?.name || 'Loading...'}
            </h2>
            <p className="text-gray-600">Target: {exercise?.targetReps || 0} reps</p>
          </div>
          <button
            onClick={() => setIsRecording(!isRecording)}
            disabled={!exercise}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } ${!exercise ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Camera className="w-5 h-5" />
            {isRecording ? 'Stop' : 'Start'} Recording
          </button>
        </div>

        {/* Video Feed */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-[600px] object-cover"
            autoPlay
            playsInline
          />
          
          {/* Rep Counter */}
          <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-lg shadow-lg">
            <p className="text-lg font-medium">
              Reps: {repCount}/{exercise?.targetReps || 0}
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-4 rounded-lg ${
            feedback.type === 'error' 
              ? 'bg-red-100 text-red-800' 
              : feedback.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            <p className="font-medium">{feedback.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoseDetection;