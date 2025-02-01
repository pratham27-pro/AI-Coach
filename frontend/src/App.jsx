import { useState } from 'react'
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Components/Home.jsx';
import Signup from './Components/Auth/Signup.jsx';
import Medical from './Components/Auth/Medical.jsx';
import Allergies from './Components/Auth/Allergies.jsx';
import Fitness from './Components/Auth/Fitness.jsx';
import Diet from './Components/Diet.jsx';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home/>
    },
    {
      path: '/signup',
      element: <Signup/>
    },
    {
      path: '/medical',
      element: <Medical/>
    },
    {
      path: '/allergies',
      element: <Allergies/>
    },
    {
      path: '/fitness',
      element: <Fitness/>
    },
    {
      path: '/diet',
      element: <Diet/>
    }
  ])
  
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
