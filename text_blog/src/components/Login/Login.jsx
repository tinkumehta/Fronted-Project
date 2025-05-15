import React, {useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {AuthContext} from '../../contexts/AuthContext'
import FormWrapper from '../FormWrapper'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      // err.response.data.error from your backend
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <FormWrapper title="Login">
      {error && <p className='text-red-500 text-center'>{error}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
        <input
         className='p-2 border rounded'
         placeholder='Useername'
         value={username}
         onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='password'
          className='p-2 border rounded'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit' className='py-2 bg-blue-500 text-white rounded'>Login</button>
      </form>
    </FormWrapper>
  )
}

export default Login