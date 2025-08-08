import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import FollowButton from "./FollowButton";

export default function SearchUser() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/v1/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setResults(res.data.data);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const handleFollowChange = (userId, isNowFollowing) => {
    setResults(prev =>
      prev.map(u =>
        u._id === userId
          ? { ...u, isFollowing: isNowFollowing }
          : u
      )
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="border px-2 py-1"
      />
      <button onClick={handleSearch} className="ml-2 px-3 py-1 bg-green-500 text-white">
        Search
      </button>

      <div className="mt-4">
        {results.map(user => (
          <div key={user._id} className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
              <span>{user.username}</span>
            </div>
            <FollowButton
               targetUserId={user._id || user.id}
              initialFollowing={user.isFollowing}
              onFollowChange={(isNowFollowing) => handleFollowChange(user._id, isNowFollowing)}
                        />
          </div>
        ))}
      </div>
    </div>
  );
}
