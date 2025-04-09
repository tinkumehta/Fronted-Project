import { useState } from 'react'
import './App.css'
import configer from './appwrite/configer.jsx'
import Register from "./componets/Pages/Register.jsx"
import Login from './componets/Pages/Login.jsx'
import { RouterProvider } from 'react-router-dom'
import {Route, createBrowserRouter, createRoutesFromElements} from 'react-router'
import Home from './componets/Pages/Home.jsx'
import Layout from './Layout.jsx'
import Dashboard from './componets/Pages/Dashboard.jsx'


//console.log(configer.appwriteStorageId);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element ={<Home />} />
      <Route path='login' element ={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='dashboard' element={<Dashboard />} />
    </Route>
  )
)

function App() {
 
 
  
  return (
   <RouterProvider router={router} />
  )
}

export default App
