import React from 'react';

const Alert = ({ message, type = 'info' }) => {
  const bgColors = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-red-500 text-red-700'
  };

  return (
    <div className={`p-4 rounded-lg border ${bgColors[type]} transition-all duration-300`}>
      {message}
    </div>
  );
};

export default Alert;