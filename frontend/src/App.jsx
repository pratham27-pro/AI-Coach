import { useState } from 'react'
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FormDataProvider } from './Components/FormDataContext.jsx';
import Home from './Components/Home.jsx';
import Signup from './Components/Auth/Signup.jsx';
import Medical from './Components/Auth/Medical.jsx';
import Allergies from './Components/Auth/Allergies.jsx';
import Fitness from './Components/Auth/Fitness.jsx';
import Diet from './Components/Diet.jsx';
import Profile from './Components/Auth/Profile.jsx';

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
    },
    {
      path: '/profile',
      element: <Profile/>
    }
  ])
  
  return (
    <FormDataProvider>
      <RouterProvider router={router}/>
    </FormDataProvider>
  )
}

export default App
