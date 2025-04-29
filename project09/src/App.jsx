import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Api from './componets/Api'

function App() {
  const [jokes, setJokes] = useState([])

  useEffect(() => {
    axios.get('/api/jokes')
    .then((response) => {
      setJokes(response.data)
    })
    .catch((error) => {
      console.log(error);
      
    })
  })

  return (
    <>
    <div>
    <h2>Chai and full stack </h2>
    <p>JOKES : {jokes.length}</p>

    {
      jokes.map((jokes) => (
        <div key={jokes.id}>
          <h3>{jokes.title}</h3>
          <p>{jokes.content}</p>
        </div>
      ))
    }
    </div>
    <Api />
    </>
  )
}

export default App
