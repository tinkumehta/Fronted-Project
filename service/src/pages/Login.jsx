import { useState } from 'react';
import {useNavigate} from "react-router-dom"
import axios from 'axios';
import  "./Login.css"

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login', form);
      console.log(res.data);
      
      localStorage.setItem('token', res.data.data.token);
     // console.log(res.data.data.createdUser.name);
     
      //alert('Logged In!');
      navigate("/")
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
   
   <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
        <input 
          placeholder="enter your email" 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
           />
          </div>
        <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
        <input 
          placeholder="enter your Password"
           type="password" 
           value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
         />
         </div>
          
        <button 
          type="submit"
           className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
            Login In
            </button>
      </form>
      <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
    
  
  );
}
