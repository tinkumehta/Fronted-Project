
import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
     
      
      <main className="flex flex-col md:flex-row justify-between items-center p-12 flex-grow">
        <div className="max-w-xl space-y-6">
          <h1 className="text-5xl font-bold text-gray-800">
            Har Service, <br /> Ek Jagah
          </h1>
          <p className="text-gray-600">
            Find and connect with service providers easily
          </p>
          <Link to="/">
          <button className="bg-blue-700 text-white px-6 py-3 rounded-md">
            Find a Service
          </button>
          </Link>
        </div>
        <div className="mt-10 md:mt-0">
          {/* Placeholder Image */}
          
        </div>
      </main>

      {/* Services */}
      <section className="flex justify-center gap-11 py-10">
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            🔌
          </div>
          <p className="mt-2">Electrician</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            🔧
          </div>
          <p className="mt-2">Plumber</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            🎓
          </div>
          <p className="mt-2">Tutor</p>
        </div>
      </section>

     
    </div>
  )
}

export default Home
