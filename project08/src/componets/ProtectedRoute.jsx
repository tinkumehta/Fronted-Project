import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from '../appwrite/config';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await get();
            } catch (error) {
                navigate('/login');
            }
        };
        checkAuth();
    }, [navigate]);

    return children;
};

export default ProtectedRoute;