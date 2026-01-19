import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
   
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    // If the context is still checking for a token, showing a loader
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;