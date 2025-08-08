// SuggestedUsers.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function SuggestedUsers() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/users/suggestions").then((res) => {
      setSuggestions(res.data.data);
    });
  }, []);

  const handleFollow = async (id) => {
    await axios.post(`/api/v1/users/follow/${id}`);
    setSuggestions((prev) => prev.filter((user) => user._id !== id));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Suggestions</h2>
      {suggestions.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between border-b pb-2 mb-2"
        >
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <span>{user.username}</span>
          </div>
          <button
            onClick={() => handleFollow(user._id)}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
}
