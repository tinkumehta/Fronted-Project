import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold">SocialApp</Link>
      <div className="space-x-4">
        <Link to="/create">Create Post</Link>
        <Link to="/profile/1">Profile</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
