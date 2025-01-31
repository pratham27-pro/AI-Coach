import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi";
import { FaDumbbell, FaRobot, FaChartLine, FaHeartbeat } from "react-icons/fa";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <FaRobot className="text-4xl mb-4" />,
      title: "AI-Powered Coaching",
      description: "Personalized workout plans adapted to your goals"
    },
    {
      icon: <FaDumbbell className="text-4xl mb-4" />,
      title: "Smart Workouts",
      description: "Real-time form correction and technique analysis"
    },
    {
      icon: <FaChartLine className="text-4xl mb-4" />,
      title: "Progress Tracking",
      description: "Advanced analytics to monitor your fitness journey"
    },
    {
      icon: <FaHeartbeat className="text-4xl mb-4" />,
      title: "Health Monitoring",
      description: "Comprehensive health and wellness insights"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      quote: "The AI coach transformed my fitness journey completely!"
    },
    {
      name: "Mike Chen",
      role: "Professional Athlete",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      quote: "Incredible results in half the time. Highly recommended!"
    },
    {
      name: "Emma Davis",
      role: "Yoga Instructor",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      quote: "The personalized approach makes all the difference."
    }
  ];

  return (
    <div className={`min-h-screen bg-white"}`}>
      {/* Navigation */}
      <Nav />

      {/* Hero Section */}
      <section className="pt-20 pb-32 relative overflow-hidden bg-gradient-to-br from-blue-50 to-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
        Transform Your Fitness Journey with{" "}
        <span className="text-blue-600">AI</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Experience personalized workout plans, real-time form correction, and
        AI-powered coaching that adapts to your progress.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
      >
        Start Your Journey
      </motion.button>
    </motion.div>

    {/* Decorative elements */}
    <div className="absolute top-0 left-0 w-full h-full z-0">
      {/* Gradient circles */}
      <div className="absolute w-64 h-64 bg-blue-100 rounded-full opacity-20 -top-32 -left-32"></div>
      <div className="absolute w-96 h-96 bg-blue-200 rounded-full opacity-20 -bottom-48 -right-48"></div>
    </div>

    {/* Animated illustration or image */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-16 flex justify-center"
    >
      <img
        src="/fotu.png" // Replace with your illustration or image
        alt="Fitness Illustration"
        className="w-50% max-w-2xl"
      />
    </motion.div>
  </div>
</section>

{/* Features Section */}
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Why Choose AI Fitness?
      </h2>
      <p className="text-xl text-gray-600">
        Discover the power of AI-driven personal training
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-blue-600">{feature.icon}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Testimonials Section */}
<section className="py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Success Stories
      </h2>
      <p className="text-xl text-gray-600">
        Hear from our satisfied members
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          />
          <p className="text-gray-600 mb-4 italic">{testimonial.quote}</p>
          <h4 className="text-lg font-semibold text-gray-900">
            {testimonial.name}
          </h4>
          <p className="text-gray-600">{testimonial.role}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>
  <Footer/>
</div>
  );
};

export default Home;
