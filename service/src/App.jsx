import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Providers from './pages/Providers';
import CreateProvider from './pages/CreateProvider';

function App() {
  return (
    <Router>
      <nav className="flex gap-4 p-4 bg-gray-200">
        <Link to="/">Providers</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/create">Add Provider</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Providers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateProvider />} />
      </Routes>
    </Router>
  );
}

export default App;
