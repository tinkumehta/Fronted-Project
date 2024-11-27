import React from 'react'
import Header from './componets/Header/Header'
import Footer from './componets/Footer/Footer'
import { Outlet } from 'react-router-dom'


const Layout = () => {
  return (
    <>
    <Header />
    <Outlet />
    <Footer />

    </>
  )
}

export default Layout