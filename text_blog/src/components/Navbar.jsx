import React, { useContext } from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../contexts/AuthContext'

function Navbar() {
  const {token, logout} = useContext(AuthContext)

  return (
    <header className='bg-white shadow'>
      <div className="container mx-auto flex justify-between items-center p-4">
      <div className="flex items-center space-x-4">
        <Link 
          to='/'
           className='text-2xl py-1 font-bold text-blue-600'>
            MyBlog
            </Link>
        <Link 
          to='/' 
          className='px-3 py-1 rounded hover:bg-gray-100'>
            All Posts
            </Link>
        {
        token && 
        <Link 
          to="/new" 
          className='px-3 py-1 bg-green-500 text-white rounded'>
            New Post
            </Link>}
        {
        token && 
        <Link to="/change-password" 
        className='px-3 py-1 bg-yellow-500 text-white rounded'>
          Change Password
          </Link>}
      </div>
      <div>
        {token ? (
          <button 
            onClick={logout} 
            className='px-4 py-2 bg-red-500 text-white rounded'>
              Logout
            </button>
        ) :(
          <>
          <Link
              to="/login"
              className='px-4 py-2 bg-blue-500 text-white rounded'>
                Login
              </Link>
            <Link 
              to="/register" 
              className='px-4 py-2 bg-green-500 text-white rounded'>
             Register
            </Link>
          </>
        )}
      </div>
      </div>
    </header>
  );
}

export default Navbar