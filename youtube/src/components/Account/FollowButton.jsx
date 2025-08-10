import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function FollowButton({ targetUserId, onFollowChange }) {
  const { user, SetUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const isFollowing = user?.following?.includes(targetUserId) || false;

  const handleClick = async () => {
    if (!user) return;

    // Optimistic update
    SetUser(prev => ({
      ...prev,
      following: isFollowing
        ? prev.following.filter(id => id !== targetUserId)
        : [...prev.following, targetUserId],
    }));
    onFollowChange?.(!isFollowing);
    setLoading(true);

    try {
      if (isFollowing) {
        await axios.post(`/api/v1/users/unfollow/${targetUserId}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else {
        await axios.post(`/api/v1/users/follow/${targetUserId}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      }
    } catch (err) {
      console.error("Follow/Unfollow error", err);
      // If API fails, revert state
      SetUser(prev => ({
        ...prev,
        following: isFollowing
          ? [...prev.following, targetUserId]
          : prev.following.filter(id => id !== targetUserId),
      }));
      onFollowChange?.(isFollowing);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1 rounded transition ${
        isFollowing
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      {loading
        ? "Processing..."
        : isFollowing
        ? "Unfollow"
        : "Follow"}
    </button>
  );
}

