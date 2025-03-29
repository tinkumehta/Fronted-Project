import { useState } from 'react'

import './App.css'
import BooksApi from './componets/BooksApi'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h2 className='text-3xl mb-2  gap-2  text-center flex justify-center'>
      Welcome to e-learing <span className='text-green-500'>Library</span></h2>
     <BooksApi />
    </>
  )
}

export default App
