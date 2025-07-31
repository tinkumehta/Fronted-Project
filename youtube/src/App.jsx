import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React,{useEffect, useState} from 'react'


import ProtectedRoute from './components/PrivateRoutes';
import Header from './components/Header/Header';
import Home from './components/Header/Home';
import Login from './components/Account/Login';
import Register from './components/Account/Register';
import Hometweet from './components/Pages/Hometweet';
import AllTweet from './components/Pages/AllTweet';
import Footer from './components/Header/Footer';

export default function App() {
  return (
     <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
       <Route 
        path='/tweet'
         element={
        <ProtectedRoute>
          <Hometweet />
        </ProtectedRoute>
       }
       />
       <Route
        path='/alltweet'
        element={ <AllTweet />}
        />
      </Routes>
     <Footer />
     </>
  );
}