// src/components/FollowButton.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function FollowButton({ targetUserId, onFollowChange }) {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // Prevent crash: user or following might be undefined
  const isFollowing = user?.following?.includes(targetUserId) || false;

  const handleClick = async () => {
    if (!user) return; // Not logged in
    setLoading(true);

    try {
      if (isFollowing) {
        await axios.post(`/api/v1/users/unfollow/${targetUserId}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        // Remove from following
        const updated = {
          ...user,
          following: user.following.filter(id => id !== targetUserId)
        };
        setUser(updated);
        onFollowChange?.(false);
      } else {
        await axios.post(`/api/v1/users/follow/${targetUserId}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        // Add to following
        const updated = {
          ...user,
          following: [...user.following, targetUserId]
        };
        setUser(updated);
        onFollowChange?.(true);
      }
    } catch (err) {
      console.error("Follow/Unfollow error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1 rounded ${isFollowing ? "bg-gray-300" : "bg-blue-500 text-white"}`}
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}