import { useState } from 'react'
import './App.css';
import Home from './Components/Home.jsx';
import Signup from './Components/Signup.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home/>
    },
    {
      path: '/signup',
      element: <Signup/>
    }
  ])
  
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
