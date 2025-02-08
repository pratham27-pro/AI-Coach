import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

const PostureDetection = ({ exercise, onComplete }) => {
  const videoRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    initializePoseDetection();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializePoseDetection = async () => {
    const model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
      runtime: 'tfjs',
      modelType: 'full'
    };
    const detector = await poseDetection.createDetector(model, detectorConfig);
    setDetector(detector);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const analyzePose = async () => {
    if (!detector || !videoRef.current) return;

    const poses = await detector.estimatePoses(videoRef.current);
    if (poses.length > 0) {
      const feedback = evaluateExerciseForm(poses[0], exercise);
      setFeedback(feedback);
    }
    
    requestAnimationFrame(analyzePose);
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full h-[600px] object-cover rounded-lg"
        autoPlay
        playsInline
      />
      {feedback && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-4 rounded-lg">
          <p className="text-lg font-medium">{feedback}</p>
        </div>
      )}
    </div>
  );
};