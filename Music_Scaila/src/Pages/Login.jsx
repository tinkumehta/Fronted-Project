import React, {useState} from "react";
import { API } from "../App";
import {useHistory} from 'react-router-dom'


const Login = () => {
    const [formData, setFormData] = useState({username: '', password :''});
    const history = useHistory();

    const {username, password} = formData;

    const onChange = (e) => 
        setFormData({...formData, [e.target.name] : e.target.value});

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', {username, password});
            localStorage.setItem('token', res.data.token);
            history.push('/sync-session');
        } catch (err) {
            console.error(err.response.data);
        }
    };

 return (
    <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={username}
          onChange={onChange}
          required
          />
        <input
          type="password"
          placeholder="enter your password"
          name="password"
          value={password}
          onChange={onChange}
          required
          />
          <button type="submit">Login</button>
    </form>
 )
    
}

 export default Login;