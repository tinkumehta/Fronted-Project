import React,{useContext, useEffect, useState} from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

function TweetForm({onTweet, editingTweet, onCancel}) {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (editingTweet) setContent(editingTweet.content);
    }, [editingTweet]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTweet) {
                const res = await axios.patch(`/api/v1/tweets/${editingTweet._id}`, {content});
                onTweet(res.data.data);         
                
            } else{
                const res = await axios.post('/api/v1/tweets', {content});
                onTweet(res.data.data)
               // console.log(res.data.data);
            }
            setContent('');
        } catch (error) {
            console.error("Tweet error", error);
        }
    };

  return (
    <form onSubmit={handleSubmit} className='mb-4'>
        <textarea 
         value={content}
         onChange={(e) => setContent(e.target.value)}
         placeholder='what happening..'
         className='w-full p-2 border rounded resize-none'
         />
        <div className="flex justify-between mt-2">
         <button 
          type='submit' 
          className='bg-blue-500 text-white px-4 py-1 rounded'>
            {editingTweet ? 'Update' : 'Tweet'}
         </button>
         {editingTweet && (
          <button 
           type='button' 
           onClick={onCancel} 
           className='text-green-600 underline'>
            Cancel
          </button>
         )}
        </div>
    </form>
  )
}

export default TweetForm