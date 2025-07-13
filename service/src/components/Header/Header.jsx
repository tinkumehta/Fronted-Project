import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          RK Fixlt
        </Link>
        <nav className="space-x-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </Link>
            <Link
            to="/create"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Add Provider
          </Link>
            <Link
            to="/testimonials"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Testimonials
          </Link>
            <Link
            to="/reviews"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Reviews
          </Link>
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Login
          </Link>
          <Link
            to="/sig"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            div
          </Link>
        
        </nav>
      </div>
    </header>
  );
}
