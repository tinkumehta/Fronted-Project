import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

function PostList() {
  const {api, token} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/posts');
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        setError('Failed to load posts')
      } finally{
        setLoading(false);
      }
    }
    fetchData();
  }, [api]);

  if (loading) return <p className='text-center mt-10'>Loading posts...</p>
  if (error) return <p className='text-center mt-10 text-red-500'>{error}</p>

  return (
   <div className="container mx-auto mt-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-3xl font-semibold">All Posts</h2>
      {token && <Link to="/new" className='px-4 py-2 bg-green-500 text-white rounded'>New Post</Link>}
    </div>
    <div className="grid md:grid-cols-2 gap-6">
    {posts.length === 0 ? (
      <p className="text-center text-gray-500">No Posts available.</p>
    ): (
      posts.map((post) => (
        <div key={post._id} className='p-4 bg-white shadow rounded'>
          <Link to ={`/posts/${post._id}`} className='text-xl font-medium text-blue-600 hover:underline'>
          {post.title}
          </Link>
        <p className="text-sm text-gray-500 mt-1">by {post.author.username}</p>
        </div>
      ))
    )}
    </div>
   </div>
  )
}

export default PostList