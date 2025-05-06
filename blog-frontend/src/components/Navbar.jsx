import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">MyBlog</Link>
        <nav className="space-x-4">
          {token ? (
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Logout</button>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
