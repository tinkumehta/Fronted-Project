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
    <div className="p-4">
      <h2 className="text-xl mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
        <input
          placeholder="Name"
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2"
           />
        <input
         placeholder="Email" 
         value={form.email} 
         onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2"
          />
        <input
         placeholder="Username" 
         value={form.username} 
         onChange={(e) => setForm({ ...form, username: e.target.value })} className="border p-2"
          />
        <input 
        placeholder="Password" 
        type="password" 
        value={form.password} 
        onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2"
         />
         <input
          placeholder='Role'
          value={form.role}
          onChange={(e) => setForm({...form , role : e.target.value})}
          className='border p-2'
         />
        <button
         type="submit" 
         className="bg-blue-500 text-white p-2">
          Register
          </button>
      </form>
    </div>
  );
}
