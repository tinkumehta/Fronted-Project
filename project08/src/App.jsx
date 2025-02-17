
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import './App.css'
import Login from "./componets/Login";
import Register from "./componets/Register";
import Dashboard from  "./componets/Dashboard";


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App
