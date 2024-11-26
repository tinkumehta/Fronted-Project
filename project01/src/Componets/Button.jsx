import React, { useState } from 'react';

function Button() {
    const [image, setImage] = useState('');

    const handleClick = () => {
        fetch('https://dog.ceo/api/breeds/image/random')
        .then(res => res.json())
        .then(data => setImage(data.message))
    }

    return (
        <div className='w-full m-2 justify-center flex font-bold size-30 h-full'>
            <button onClick={handleClick} className='m-2 p-3 border-solid '>Click Me
                <img src={image} alt="Dog Image" className='w-full h-full' />
            </button>
            
        </div>
    )
 
}

export default Button