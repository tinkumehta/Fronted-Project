// Dashboard.jsx
import React from 'react';
import { logout } from '../appwrite/config';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="dashboard">
        <h1>Welcome to Your Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;