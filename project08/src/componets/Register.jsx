import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../appwrite/config';
import './Auth.css'

function Register() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setError('')
        setLoading(true)
        try {
            await register(email, password, name);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message || "Registration failed")
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Create Account</h2>
                {error && <div className='error-message'>{error}</div>}

                <div className="form-group">
                    <input
                        type='text'
                        value={name}
                        placeholder='enter your name'
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type='email'
                        value={email}
                        placeholder='enter your email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type='password'
                        value={password}
                        placeholder='enter your password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button 
                    className='submit-btn' 
                    type='button'
                    onClick={handleRegister}
                    disabled={loading}
                    >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
                <div className="nav-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    )
}