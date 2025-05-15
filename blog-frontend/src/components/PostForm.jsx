import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import FormWrapper from './FormWrapper';

export default function PostForm() {
  const { api } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/posts/${id}`)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
        })
        .catch(() => setError('Failed to load post'))
        .finally(() => setLoading(false));
    }
  }, [api, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (id) await api.put(`/posts/${id}`, { title, content });
      else await api.post('/posts', { title, content });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Submit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper title={id ? 'Edit Post' : 'New Post'}>
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          className="p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="p-2 border rounded h-40"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </FormWrapper>
  );
}
