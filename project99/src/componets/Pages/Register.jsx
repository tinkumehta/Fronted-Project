import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { register } from '../../appwrite/auth';
import './Login.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
   

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
          const user =  await register(email, password, name);
          if (user) {
            navigate("/dashboard");
          }
            
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Register</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            value={name}
                            id={name}
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                            id={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            id={confirm-password}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                <div className="nav-link">
                    Already have an account ? <Link to="/login">Login</Link>
                </div>
              
            </div>
        </div>
    );
}

export default Register;