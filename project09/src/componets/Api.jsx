import React, {useState} from 'react'

function Api() {
    const [data, setData] = useState([])

    const dataFetch = async () => {
        const res = await fetch('http://localhost:3000/api/jokes')
        const api = res.json();
        setData(api)
    }
    //console.log(da);

    
  return (
    <div>
        <h2>Api calls</h2>
        <p>Data : {data.id}</p>
    </div>
  )
}

export default Api