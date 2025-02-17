import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import Alert from '../Alert.jsx';

const calculateAngle = (a, b, c) => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
};

const evaluateExerciseForm = (pose, exercise) => {
  const keypoints = pose.keypoints;
  const keypointMap = Object.fromEntries(keypoints.map(kp => [kp.name, kp]));

  switch (exercise.name.toLowerCase()) {
    case 'push-ups': {
      const leftShoulder = keypointMap['left_shoulder'];
      const leftElbow = keypointMap['left_elbow'];
      const leftWrist = keypointMap['left_wrist'];
      const leftHip = keypointMap['left_hip'];
      
      const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const backAngle = calculateAngle(leftShoulder, leftHip, keypointMap['left_knee']);
      
      if (!elbowAngle || !backAngle) return {
        message: "Please ensure your full body is visible",
        type: 'warning'
      };
      
      let feedback = [];
      let type = 'success';
      
      if (elbowAngle > 90) {
        feedback.push("Lower your body until your elbows are at 90 degrees");
        type = 'warning';
      }
      
      if (backAngle < 160) {
        feedback.push("Keep your back straight");
        type = 'warning';
      }
      
      return {
        message: feedback.length > 0 ? feedback.join(". ") : "Good form! Keep going!",
        type: feedback.length > 0 ? 'warning' : 'success'
      };
    }
    
    case 'bodyweight lunges': {
      const frontKnee = keypointMap['left_knee'];
      const frontAnkle = keypointMap['left_ankle'];
      const frontHip = keypointMap['left_hip'];
      
      const frontKneeAngle = calculateAngle(frontHip, frontKnee, frontAnkle);
      
      let feedback = [];
      let type = 'success';
      
      if (frontKneeAngle < 85 || frontKneeAngle > 95) {
        feedback.push("Bend your front knee to 90 degrees");
        type = 'warning';
      }
      
      if (frontKnee.x < frontAnkle.x) {
        feedback.push("Keep your front knee behind your toes");
        type = 'warning';
      }
      
      return {
        message: feedback.length > 0 ? feedback.join(". ") : "Excellent lunge form!",
        type
      };
    }
    
    default:
      return {
        message: "Exercise form evaluation not implemented for this exercise",
        type: 'info'
      };
  }
};

const Posture = ({ exercise, onComplete }) => {
  const videoRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [goodFormStreak, setGoodFormStreak] = useState(0);

  useEffect(() => {
    initializePoseDetection();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializePoseDetection = async () => {
    try {
      const model = poseDetection.SupportedModels.BlazePose;
      const detectorConfig = {
        runtime: 'tfjs',
        modelType: 'full'
      };
      const detector = await poseDetection.createDetector(model, detectorConfig);
      setDetector(detector);
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error during initialization:', error);
      setFeedback({
        message: "Unable to access camera. Please check permissions.",
        type: 'error'
      });
    }
  };

  const analyzePose = async () => {
    if (!detector || !videoRef.current || !isRecording) return;

    try {
      const poses = await detector.estimatePoses(videoRef.current);
      if (poses.length > 0) {
        const currentFeedback = evaluateExerciseForm(poses[0], exercise);
        setFeedback(currentFeedback);
        
        if (currentFeedback.type === 'success') {
          setGoodFormStreak(prev => prev + 1);
          if (goodFormStreak >= 30) { // About 1 second of good form
            setRepCount(prev => prev + 1);
            setGoodFormStreak(0);
          }
        } else {
          setGoodFormStreak(0);
        }
        
        if (repCount >= 10) {
          onComplete && onComplete();
          setIsRecording(false);
        }
      }
    } catch (error) {
      console.error('Error during pose detection:', error);
      setFeedback({
        message: "Error during pose detection. Please try again.",
        type: 'error'
      });
    }
    
    requestAnimationFrame(analyzePose);
  };

  useEffect(() => {
    if (isRecording) {
      analyzePose();
    }
  }, [isRecording, detector]);

  return (
    <div className="relative max-w-4xl mx-auto p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{exercise.name}</h2>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Camera className="w-5 h-5" />
            {isRecording ? 'Stop' : 'Start'} Recording
          </button>
        </div>
        
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-[600px] object-cover rounded-lg"
            autoPlay
            playsInline
          />
          
          <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg shadow-lg">
            <p className="text-lg font-medium">Reps: {repCount}/10</p>
          </div>
        </div>

        {feedback && (
          <div className="absolute bottom-8 left-8 right-8">
            <CustomAlert 
              message={feedback.message} 
              type={feedback.type} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Posture;