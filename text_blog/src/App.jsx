import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import {AuthProvider} from "./contexts/AuthContext"

import Navbar from './components/Navbar'
import Register from './components/Login/Register'
import Login from './components/Login/Login'
import ChangePassword from './components/ChangePassword'
import PostList from './components/Post/PostList'
import PostForm from './components/Post/PostForm'
import PostDetail from './components/Post/PostDetail'

import './App.css'

function App() {

  return (
   <AuthProvider>
    <BrowserRouter>
  <Navbar />
    <Routes >
       
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/change-passsword' element={<ChangePassword />} />
      <Route path='/new' element={<PostForm />} />
      <Route path='/edit/:id' element={<PostForm />} />
      <Route path='/posts/:id' element={<PostDetail />} />
      <Route path='/' element={<PostList />} />
    </Routes>
    </BrowserRouter>
   </AuthProvider>
  )
}

export default App
