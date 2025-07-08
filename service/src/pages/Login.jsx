import { useState } from 'react';
import {useNavigate} from "react-router-dom"
import axios from 'axios';

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
    <div className="p-4">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
        <input 
          placeholder="Email" 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2"
           />
        <input 
          placeholder="Password"
           type="password" 
           value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
            className="border p-2"
         />
        <button 
          type="submit"
           className="bg-blue-500 text-white p-2">
            Login
            </button>
      </form>
    </div>
  );
}
