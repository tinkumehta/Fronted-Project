import React from 'react'
import Header from "./componets/Pages/Header"
import { Outlet } from 'react-router'
import Footer from './componets/Pages/Footer'

export default function Layout() {
  return (
    <>
    <Header />
    <Outlet />
    <Footer />
    </>
  )
}
