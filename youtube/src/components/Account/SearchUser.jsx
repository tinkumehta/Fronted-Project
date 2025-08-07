// SearchUsers.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [following, setFollowing] = useState({});

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/v1/users/search?query=${query}`);
      setResults(res.data.data);
    //  console.log(res);
      
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axios.post(`/api/v1/users/follow/${userId}`);
      setFollowing((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error("Follow failed", error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-4 py-2 rounded w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
      >
        Search
      </button>

      <div className="mt-4 space-y-3">
        {results.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between border p-3 rounded"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">@{user.username}</span>
            </div>
            {!following[user._id] ? (
              <button
                onClick={() => handleFollow(user._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Follow
              </button>
            ) : (
              <span className="text-gray-400 text-sm">Following</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;
