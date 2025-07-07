import { useEffect, useState } from "react";
import API from "../api/api";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await API.get("/posts");
      setPosts(res.data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold mb-4">Feed</h1>
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
