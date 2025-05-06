import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function PostList() {
  const { api, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => { api.get('/posts').then(res => setPosts(res.data)); }, []);

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold">All Posts</h2>
        {token && <Link to="/new" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">New Post</Link>}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map(p => (
          <div key={p._id} className="p-4 bg-white shadow rounded">
            <Link to={`/posts/${p._id}`} className="text-xl font-medium text-blue-600 hover:underline">{p.title}</Link>
            <p className="text-sm text-gray-500 mt-1">by {p.author.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
