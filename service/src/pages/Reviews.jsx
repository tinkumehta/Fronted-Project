import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Reviews() {
  const [providerId, setProviderId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: '', comment: '' });

  const fetchReviews = async () => {
    if (!providerId) return;
    const res = await axios.get(`http://localhost:8000/api/reviews/${providerId}`);
    setReviews(res.data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/api/reviews',
        { providerId, rating: form.rating, comment: form.comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
     // alert('Review added!');
      setForm({ rating: '', comment: '' });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding review');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Provider Reviews</h2>

      <input
        placeholder="Provider ID"
        value={providerId}
        onChange={(e) => setProviderId(e.target.value)}
        className="border p-2 mb-4"
      />
      <button onClick={fetchReviews} className="bg-blue-500 text-white p-2 mb-4 ml-2">
        Load Reviews
      </button>

      <ul className="space-y-2 mb-6">
        {reviews.map((r) => (
          <li key={r._id} className="border p-2">
            <strong>Rating:</strong> {r.rating} ⭐ <br />
            <strong>Comment:</strong> {r.comment} <br />
            <em>By: {r.user?.name || 'Unknown'}</em>
          </li>
        ))}
      </ul>

      <h3 className="text-lg mb-2">Add Review</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
        <input
          placeholder="Rating (1-5)"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
          className="border p-2"
        />
        <textarea
          placeholder="Comment"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="border p-2"
        ></textarea>
        <button type="submit" className="bg-green-500 text-white p-2">
          Submit Review
        </button>
      </form>
    </div>
  );
}
