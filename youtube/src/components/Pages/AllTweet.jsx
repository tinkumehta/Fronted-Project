// src/components/AllTweets.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const AllTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchAllTweets = async () => {
      try {
        const res = await axios.get("/api/v1/tweets/all"); // Your backend endpoint
        setTweets(res.data.data);
      } catch (err) {
        console.error("Failed to load tweets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTweets();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading tweets...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col gap-4">
      {tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
    </div>
  );
};

const TweetCard = ({ tweet }) => {
  
    const [likesCount, setLikesCount] = useState(tweet.likesCount || 0);
    const [isLiked, setIsLiked] = useState(tweet.isLiked || false);

    const [animate, setAnimate] = useState(false);

  const handleLikeToggle = async () => {
    try {
      const res = await axios.post(`/api/v1/likes/toggle/t/${tweet._id}`);
      const liked = res.data.data.likedBy;
    //  console.log(liked);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
      // Update UI based on toggle response
      setIsLiked(liked);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
     <div className="bg-white shadow-md rounded-2xl p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">
            {tweet.ownerDetails?.fullName || "Unknown"}
          </h3>
          <p className="text-xs text-gray-500">
            @{tweet.ownerDetails?.username || "unknown"}
          </p>
        </div>
        <p className="text-xs text-gray-400">
          {dayjs(tweet.createdAt).fromNow()}
        </p>
      </div>

      <p className="text-gray-800 text-sm mb-3 whitespace-pre-wrap">
        {tweet.content}
      </p>

      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center gap-1 transition-all duration-300 ${
            isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
          } ${animate ? "scale-125" : "scale-100"}`}
        >
          <span className="text-xl">{isLiked ?  "❤️" : "🤍"}</span>
           {likesCount}
        </button>
      </div>
    </div>
  );
};

export default AllTweets;
