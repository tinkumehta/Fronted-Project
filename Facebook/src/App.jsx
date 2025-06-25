import { useState } from 'react'
import './App.css'
import conf from './conf/conf'

function App() {
 console.log(conf.appwriteProjectId);
 console.log(conf.appwriteUrl);
 

  return (
    <>
    <div className="facebook">
      <h2>Facebook</h2>
    </div>
    </>
  )
}

export default App
