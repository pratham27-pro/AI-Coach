import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { useParams, useNavigate } from 'react-router-dom';

const exerciseFormChecks = {
  // test exercise
  'neck-posture': {
  name: 'Neck Posture Check',
  type: 'test',
  keypoints: ['nose', 'left_ear', 'right_ear', 'left_eye', 'right_eye', 'left_shoulder', 'right_shoulder'],
  targetReps: 5,
  checks: [
    {
      name: 'headTilt',
      points: ['left_ear', 'nose', 'right_ear'],
      range: { min: 170, max: 190 }, // Almost straight line for head level
      message: "Keep your head level - don't tilt left or right"
    },
    {
      name: 'neckForward',
      points: ['nose', 'left_ear', 'left_shoulder'],
      range: { min: 70, max: 100 }, // Checks for forward head posture
      message: "Keep your head back - don't lean forward"
    },
    {
      name: 'shoulderLevel',
      points: ['left_shoulder', 'right_shoulder', 'nose'],
      range: { min: 170, max: 190 }, // Shoulders should be level
      message: "Keep your shoulders level"
    }
  ]
}, 
  
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
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [goodFormStreak, setGoodFormStreak] = useState(0);
  const [currentPose, setCurrentPose] = useState(null);
  const detectionLoopRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const isDetectionRunning = useRef(false);

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
      console.log('1. Starting initialization...'); // Debug log

      await tf.ready();
      console.log('2. TensorFlow.js is ready'); 

      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        {
          runtime: 'tfjs',
          modelType: 'full'
        }
      );
      setDetector(detector);

      try {
        console.log('3. Creating detector...');

        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.BlazePose,
          {
            runtime: 'tfjs',
            modelType: 'full'
          }
        );
        console.log('4. Detector created successfully'); // Debug log
        setDetector(detector);

        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        console.log('5. Got camera stream');

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            console.log('6. Video metadata loaded');
            videoRef.current.play();
            // Set canvas size to match video
            if (canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;

              console.log('7. Canvas size set:', {
                width: canvasRef.current.width,
                height: canvasRef.current.height
              });
              
              setTimeout(() => {
                setIsVideoReady(true);
                console.log('Video is now fully ready');
              }, 500);

            }
          };
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setFeedback({
          message: "Camera access denied. Please check permissions.",
          type: 'error'
        });
      }
    };

    initPoseDetection();

    return () => {
      if (detectionLoopRef.current) {
        cancelAnimationFrame(detectionLoopRef.current);
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const drawPose = (pose) => {
    if (!canvasRef.current || !videoRef.current || !exercise) {
      console.log('Cannot draw pose: missing required refs or exercise data');
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    //debug
    console.log('Drawing pose on canvas:', {
      canvasWidth: canvasRef.current.width,
      canvasHeight: canvasRef.current.height,
      videoWidth: videoRef.current.videoWidth,
      videoHeight: videoRef.current.videoHeight,
      keypoints: pose.keypoints.length
    });

    // Set canvas dimensions to match video
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Draw keypoints
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = exercise.keypoints.includes(keypoint.name) ? '#00ff00' : '#ffffff';
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.fillText(keypoint.name, keypoint.x + 5, keypoint.y - 5);
      }
    });

    // Draw connections
    const connections = [
      ['nose', 'left_eye'], ['left_eye', 'left_ear'],
      ['nose', 'right_eye'], ['right_eye', 'right_ear'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
    ];

    let drawnConnections = 0;

    connections.forEach(([p1, p2]) => {
      const point1 = pose.keypoints.find(kp => kp.name === p1);
      const point2 = pose.keypoints.find(kp => kp.name === p2);

      if (point1?.score > 0.3 && point2?.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        drawnConnections++;
      }
    });

    console.log(`Drew ${drawnConnections} connections`);

    // Draw angles for current exercise
    if (exercise.checks) {
      let drawnAngles = 0;

      exercise.checks.forEach(check => {
        if (check.points && check.points.length === 3) {
          const points = check.points.map(p => pose.keypoints.find(kp => kp.name === p));

          console.log('Angle check points:', {
            names: check.points,
            found: points.map(p => p ? `${p.name} (${p.score.toFixed(2)})` : 'missing'),
            valid: points.every(p => p?.score > 0.3)
          });

          if (points.every(p => p?.score > 0.3)) {
            const angle = calculateAngle(
              { x: points[0].x, y: points[0].y },
              { x: points[1].x, y: points[1].y },
              { x: points[2].x, y: points[2].y }
            );
            
            if (angle !== null) {
              const midPoint = points[1];
              
              // Draw angle arc
              ctx.beginPath();
              ctx.arc(midPoint.x, midPoint.y, 30, 0, (angle * Math.PI) / 180);
              ctx.strokeStyle = (angle >= check.range.min && angle <= check.range.max) ? '#00ff00' : '#ff0000';
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Draw angle text
              ctx.font = '16px Arial';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(`${Math.round(angle)}°`, midPoint.x + 35, midPoint.y);

              drawnAngles++;
              
              console.log('Drew angle:', {
                points: check.points,
                angle,
                inRange: (angle >= check.range.min && angle <= check.range.max)
              });
            }
          }
        }
      });
      console.log(`Drew ${drawnAngles} angles`);
    }
  };

  const checkForm = (pose, exercise) => {

    if (!pose || !exercise) return { message: "Waiting for detection...", type: 'warning', isGoodForm: false };

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
      const formattedPoints = points.map(p => p && { x: p.x, y: p.y });
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

  const startDetectionLoop = () => {
    if (isDetectionRunning.current) return;
    
    isDetectionRunning.current = true;
    console.log('Starting continuous detection loop');
    detectPose();
  };
  
  const detectPose = async () => {
    // Check if all conditions for detection are met
    if (!detector || !videoRef.current || !isVideoReady || !canvasRef.current) {
      console.log('Not ready yet:', {
        detector: !!detector,
        video: !!videoRef.current,
        canvas: !!canvasRef.current,
        isVideoReady
      });
      
      // Continue the loop even if not ready
      if (isDetectionRunning.current) {
        detectionLoopRef.current = requestAnimationFrame(detectPose);
      }
      return;
    }

    try {
      console.log('Detecting poses...');
      const poses = await detector.estimatePoses(videoRef.current, {
        flipHorizontal: false
      });
      
      if (poses.length > 0) {
        console.log('Pose detected with keypoints:', poses[0].keypoints.length);

        // Store current pose and draw it
        setCurrentPose(poses[0]);
        drawPose(poses[0]);

        // Handle rep counting if recording is active
        if (isRecording && exercise) {
          const formCheck = checkForm(poses[0], exercise);
          setFeedback(formCheck);

          if (formCheck.isGoodForm) {
            setGoodFormStreak(prev => {
              const newStreak = prev + 1;
              console.log(`Good form streak: ${newStreak}`);
              return newStreak;
            });
            
            if (goodFormStreak >= 30) {
              setRepCount(prev => {
                const newCount = prev + 1;
                console.log(`Rep count increased to ${newCount}`);
                return newCount;
              });
              setGoodFormStreak(0);
            }
          } else {
            if (goodFormStreak > 0) {
              console.log("Breaking streak due to bad form");
            }
            setGoodFormStreak(0);
          }
          
          if (repCount >= (exercise.targetReps || 0)) {
            setIsRecording(false);
            setFeedback({
              message: "Great job! Exercise completed!",
              type: 'success'
            });
            setTimeout(() => navigate('/workout'), 3000);
          }
        }
      } else {
        console.log('No poses detected in this frame');
      }
    } catch (error) {
      console.error('Pose detection error:', error);
      setFeedback({
        message: "Error during pose detection",
        type: 'error'
      });
    }
    
    // Continue the loop only if we're still supposed to be running
    if (isDetectionRunning.current) {
      detectionLoopRef.current = requestAnimationFrame(detectPose);
    }
  };

  useEffect(() => {
    if (detector && isVideoReady && !isDetectionRunning.current) {
      console.log('Everything ready, starting detection loop');
      startDetectionLoop();
    }
  }, [detector, isVideoReady]);

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
            muted
          />

          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ backgroundColor: 'transparent' }}
          />
          
          {/* Rep Counter */}
          <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-lg shadow-lg">
            <p className="text-lg font-medium">
              Reps: {repCount}/{exercise?.targetReps || 0}
            </p>
          </div>
        </div>

        {/* Form Guide */}
          <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg max-w-sm">
            <h3 className="font-medium mb-2">Form Guide</h3>
            <ul className="space-y-2">
              {exercise?.checks.map((check, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    currentPose && checkForm(currentPose, { checks: [check] }).isGoodForm
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`} />
                  {check.message}
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-lg shadow-lg">
            <p className="text-sm font-mono">
              Status: {isRecording ? 'Recording' : 'Ready'}
            </p>
            <p className="text-sm font-mono">
              Reps: {repCount}
            </p>
            <p className="text-sm font-mono">
              Streak: {goodFormStreak}
            </p>
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

        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
        <p>Detector: {detector ? 'Ready ✓' : 'Loading...'}</p>
          <p>Video: {videoRef.current?.readyState === 4 ? 'Ready ✓' : 'Loading...'}</p>
          <p>Canvas: {canvasRef.current ? 'Ready ✓' : 'Loading...'}</p>
          <p>Detection Active: {isDetectionRunning.current ? 'Yes ✓' : 'No'}</p>
          <p>Video Ready State: {isVideoReady ? 'Ready ✓' : 'Initializing...'}</p>
          </div>
      </div>
    </div>
  );
};

export default PoseDetection;