
import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router'

function Github() {
  const data = useLoaderData()
   // const [data, setData] = useState('')

    // useEffect(() => {
    //     fetch('https://api.github.com/users/tinkumehta')
    //     .then(res => res.json())
    //     .then (data => setData(data))
    // },[])

  return (
    <div>
      <div className="w-full h-full">
        <img src={data.avatar_url} alt="profile phota" className='m-2 ' />
        {/* <h3 className='m-2 flex justify-center'>{data.bio}</h3> */}
        </div>
    </div>
  )
}

export default Github

 export const githubInfoLoader = async function () {
  const response = await fetch('https://api.github.com/users/tinkumehta')
  return response.json();
}