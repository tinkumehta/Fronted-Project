import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Providers from './pages/Providers';
import CreateProvider from './pages/CreateProvider';
import Reviews from './pages/Reviews';
import Testimonials from "./pages/Testimonials"
import Footer from './components/Footer';
import SignIn from './components/Login/SignIn';
import Header from './components/Header/Header';

function App() {
  return (
    <Router>
      {/* <nav className="flex gap-4 p-4 bg-white">
        <Link to="/">Providers</Link>
       
        <Link to="/login">Login</Link>
        <Link to="/create">Add Provider</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/testimonials">Testimonials</Link>
        <Link to ="/sig">Sig</Link>
        
      </nav> */}
      <Header />
      <Routes>
        <Route path="/" element={<Providers />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateProvider />} />
        <Route path='/reviews' element={<Reviews />} />
        <Route path='/testimonials' element={<Testimonials />} />
        <Route path='/sig' element={<SignIn />} />
       
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
