import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState('');

  const fetchProviders = async () => {
    const url = search ? `http://localhost:8000/api/providers/search?category=${search}` : `http://localhost:8000/api/providers`;
    const res = await axios.get(url);
   // console.log(res.data.data);
    setProviders(res.data.data);
  };

  useEffect(() => {
    fetchProviders();
  }, [search]);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Service Providers</h2>
      <input 
       placeholder="Search category..." 
       value={search} onChange={(e) => setSearch(e.target.value)} 
       className="border p-2 mb-4" 
       />
      <ul className="space-y-2">
        {providers.map((p) => (
          <li key={p._id} className="border p-2">
            <h3 className="font-bold">{p.name}</h3>
            <p>Category: {p.category}</p>
            <p>Contact: {p.contact}</p>
            <p>Location: {p.location}</p>
            <p>{p.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
