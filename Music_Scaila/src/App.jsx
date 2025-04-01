import { useState } from 'react'
import axios from 'axios';
import './App.css'
import Login from './Pages/Login';
import Register from './Pages/Register';
import syncSession from './Pages/SyncSession';

export const API = axios.create({
  baseURL : 'http://localhost:5000/api',
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     
    </>
  )
}

export default App
