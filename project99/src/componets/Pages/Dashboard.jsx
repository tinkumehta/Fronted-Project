import React, { useState } from 'react'
import { logout } from '../../appwrite/auth';
import {useNavigate} from "react-router-dom"
import FileUpload from './FileUpload';

function Dashboard() {
  const navigate = useNavigate();

  
  const handleLogout = async () => {
    try {
        await logout();
        navigate('/login');
    } catch (error) {
        console.error(error);
    }
}
  

  
 // access login data

  return (
    <div>
      <h2>Wel Come</h2>

      <FileUpload />
      <button type='button' className='m-5 p-4  border cursor-pointer bg-sky-300 hover:bg-sky-700 text-black rounded-2xl text-2xl'
        onClick={(() => handleLogout())}
      >Logout</button>
      
    </div>
  )
}

export default Dashboard