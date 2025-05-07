import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import FormWrapper from './FormWrapper';

export default function ChangePassword() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const { changePassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await changePassword(oldPass, newPass);
    navigate('/login');
  };

  return (
    <FormWrapper title="Change Password">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="password"
          className="p-2 border rounded"
          placeholder="Old Password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />
        <input
          type="password"
          className="p-2 border rounded"
          placeholder="New Password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <button type="submit" className="py-2 bg-yellow-500 text-white rounded">Change Password</button>
      </form>
    </FormWrapper>
  );
}