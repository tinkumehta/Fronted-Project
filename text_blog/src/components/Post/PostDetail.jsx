import React, {useState, useEffect, useContext} from 'react'
import {useParams, Link, useNavigate} from 'react-router-dom';
import {AuthContext} from "../../contexts/AuthContext"

function PostDetail() {
  const {api, token} = useContext(AuthContext);
  const {id} = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => setPost(res.data));

  }, [api, id]);

  const handleDelete = async () => {
    await api.delete(`/posts/${id}`);
    navigate('/');
  };

  if(!post) return <p className='text-center mt-10'>Loading...</p>;

  return (
    <div className='container mx-auto mt-8 p-6 bg-white shadow rounded'>
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="text-gray-700 mb-6">{post.content}</p>
      <p className="text-sm text-gray-500 mb-4">By {post.author.username}</p>
      <div className="flex space-x-4">
        {token && <Link to={`/edit/${id}`} className='px-4 py-2 bg-yellow-500 text-white rounded'>Edit</Link>}
        {token && <button onClick={handleDelete} className='px-4 py-2 bg-red-500 text-white rounded'>Delete</button>}
      </div>
    </div>
  );
}

export default PostDetail