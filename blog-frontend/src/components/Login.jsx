import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import FormWrapper from './FormWrapper';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    await login(username, password);
    navigate('/');
  };

  return (
    <FormWrapper title="Login">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input className="p-2 border rounded" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" className="p-2 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Login</button>
      </form>
    </FormWrapper>
  );
}