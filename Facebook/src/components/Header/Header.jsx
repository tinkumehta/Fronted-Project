import React from 'react'
import {useSelector} from "react-redux"
import {Link, useNavigate} from "react-router-dom"
import {Logo, LogoutBtn, Container} from "../index"

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    {
      name : 'Home',
      slug : '/',
      active : true
    },
    {
      name : "Login",
      slug : "/login",
      active : !authStatus
    },
    {
            name : 'All Posts',
            slug : "/all-post",
            active : authStatus
        }, 
        {
            name : 'Add Post',
            slug : "/add-Post",
            active : authStatus,
        },
  ]


  return (
    <header className='py-3 shadow bg-gray-500'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to="/">
            <Logo width='70px' />
            </Link>
          </div>
        
        <ul className='flex ml-auto'>
          {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button 
                  onClick={() => navigate(item.slug)}
                  className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
                    {item.name}
                  </button>
              </li>
            ) : null
          )}
        {authStatus && (
          <li>
            <LogoutBtn />
          </li>
        )}
        </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header