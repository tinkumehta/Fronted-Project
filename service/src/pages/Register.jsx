import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom"

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '',username : '', password: '', role : '' });

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/register', form);
       navigate("/login")
      //alert('Registered! Now Login.');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">
              Name
            </label>
        <input
          placeholder="Name"
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
           />
           </div>

           <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
        <input
         placeholder="Email" 
         value={form.email} 
         onChange={(e) => setForm({ ...form, email: e.target.value })} 
         className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          </div>
        <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium">
              Username
            </label>
        <input
         placeholder="Username" 
         value={form.username} 
         onChange={(e) => setForm({ ...form, username: e.target.value })} 
         className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
        <input 
        placeholder="Password" 
        type="password" 
        value={form.password} 
        onChange={(e) => setForm({ ...form, password: e.target.value })} 
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
         />
         </div>
         <div>
            <label htmlFor="role" className="block mb-1 text-sm font-medium">
              Role
            </label>
            
         <input
          placeholder='Role'
          value={form.role}
          onChange={(e) => setForm({...form , role : e.target.value})}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
         />
         </div>
        <button
         type="submit" 
         className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
          Register
          </button>
      </form>
      <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
    </div>
    </div>
  );
}
