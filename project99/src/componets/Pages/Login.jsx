import React, {useState} from "react";
import './Login.css'
import { login, logout } from "../../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../../project06/src/appwrite/config";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [logined , setLogged] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
   

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
         const loginUser =  await login(email, password);
            navigate("/dashboard");
         if (loginUser) {
            setLogged(await get());
         }
           
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    
   

    return (
        <div>
        {
            logined ?  <div>
                <h2>Welcome {logined.name}</h2>

            </div>
            :
        
        <div className="auth-container">
        <div className="auth-form">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? 'Logging In...' : 'Login'}
                </button>
            </form>
            <div className="nav-link">
                Don't have an account? <Link to="/register">Register</Link>
            </div>
           
            
        </div>
    </div>
        }
        </div>
    );
};

export default Login