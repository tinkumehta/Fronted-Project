import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [providerId, setProviderId] = useState('');
  const [message, setMessage] = useState('');

  const fetchTestimonials = async () => {
    const res = await axios.get('http://localhost:8000/api/testimonials');
    setTestimonials(res.data.data);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/api/testimonials',
        { providerId, message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
     // alert('Testimonial added!');
      setMessage('');
      setProviderId('');
      fetchTestimonials();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding testimonial');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Testimonials</h2>

      <ul className="space-y-2 mb-6">
  {testimonials.map((t) => (
    <li key={t._id} className="border p-2">
      <strong>{t.user?.name || 'Unknown'}:</strong> {t.message} <br />
      <em>Provider: {t.provider?.name || t.provider?._id || 'Unknown'}</em>
    </li>
  ))}
</ul>

      <h3 className="text-lg mb-2">Add Testimonial</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm">
        <input
          placeholder="Provider ID"
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
          className="border p-2"
        />
        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2"
        ></textarea>
        <button type="submit" className="bg-green-500 text-white p-2">
          Submit Testimonial
        </button>
      </form>
    </div>
  );
}
