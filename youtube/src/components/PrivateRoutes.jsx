import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({children}) {
    const {user, loading} = useContext(AuthContext);
    const navigate = useNavigate()
    
    if(loading) return <p>Loding...</p>

    if (!user) {
      return  navigate("/login");
    }

    return children;
}