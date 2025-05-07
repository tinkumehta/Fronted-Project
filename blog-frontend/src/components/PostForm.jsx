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

  useEffect(() => {
    if (id) {
      api.get(`/posts/${id}`).then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
      });
    }
  }, [api, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await api.put(`/posts/${id}`, { title, content });
    else await api.post('/posts', { title, content });
    navigate('/');
  };

  return (
    <FormWrapper title={id ? 'Edit Post' : 'New Post'}>
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
        <button type="submit" className="py-2 bg-blue-500 text-white rounded">{id ? 'Update' : 'Create'}</button>
      </form>
    </FormWrapper>
  );
}