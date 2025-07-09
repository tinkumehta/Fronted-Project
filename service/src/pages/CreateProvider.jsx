import { useState } from 'react';
import axios from 'axios';

export default function CreateProvider() {
  const [form, setForm] = useState({ name: '', category: '', contact: '', location: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/providers', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Provider Created');
    } catch (err) {
      alert(err.response.data.message || 'Error');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Add Service Provider</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
        <input 
         placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
           className="border p-2"
         />
        <input 
         placeholder="Category"
         value={form.category} 
         onChange={(e) => setForm({ ...form, category: e.target.value })} 
         className="border p-2"
          />
        <input 
         placeholder="Contact" 
         value={form.contact}
         onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="border p-2"
         />
        <input 
         placeholder="Location" 
         value={form.location} 
         onChange={(e) => setForm({ ...form, location: e.target.value })} 
         className="border p-2"
          />
        <textarea 
         placeholder="Description" 
         value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} 
          className="border p-2"></textarea>
        <button type="submit" className="bg-green-500 text-white p-2">Add</button>
      </form>
    </div>
  );
}
