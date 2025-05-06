import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import FormWrapper from './FormWrapper';

export default function ChangePassword() {
  const [oldPassword, setOld] = useState('');
  const [newPassword, setNew] = useState('');
  const { changePassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async e => { e.preventDefault(); await changePassword(oldPassword, newPassword); navigate('/login'); };

  return (
    <FormWrapper title="Change Password">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input type="password" className="p-2 border rounded" placeholder="Old Password" value={oldPassword} onChange={e => setOld(e.target.value)} />
        <input type="password" className="p-2 border rounded" placeholder="New Password" value={newPassword} onChange={e => setNew(e.target.value)} />
        <button type="submit" className="py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Change</button>
      </form>
    </FormWrapper>
  );
}