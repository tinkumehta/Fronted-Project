import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React,{useEffect, useState} from 'react'


import ProtectedRoute from './components/PrivateRoutes';
import { 
  Home, Header, Login, 
  Register, Hometweet, 
  AllTweet, Footer} from './components';
  import SearchUsers from './components/Account/SearchUser';


export default function App() {
  return (
     <>
      <Header />
      <Routes>
        {/* <Route path='/' element={<Home />} /> */}
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
        path='/search'
         element={
        <ProtectedRoute>
          <SearchUsers />
        </ProtectedRoute>
       }
       />
       <Route
        path='/'
        element={
          <ProtectedRoute>
             <AllTweet />
          </ProtectedRoute>
          }
        />
      </Routes>
     <Footer />
     </>
  );
}