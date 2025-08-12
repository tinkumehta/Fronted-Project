import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React,{useEffect, useState} from 'react'


import ProtectedRoute from './components/PrivateRoutes';
import { 
   Header, Login, 
  Register,  
  AllTweet, Footer} from './components';
  import SearchUsers from './components/Account/SearchUser';
  import SuggestedUsers from './components/Account/SuggestedUser';
  import ProfileStats from './components/Account/ProfileStats';



export default function App() {
  return (
     <>
      <Header />
      <Routes>
        {/* <Route path='/' element={<Home />} /> */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      
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
       <Route
        path='/profile'
        element={
          <ProtectedRoute>
             <ProfileStats />
          </ProtectedRoute>
          }
        />
       <Route
        path='/suggestions'
        element={
          <ProtectedRoute>
             <SuggestedUsers />
          </ProtectedRoute>
          }
        />
      </Routes>
     <Footer />
     </>
  );
}