export default function PostCard({ post }) {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="text-xl font-bold">{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
}
