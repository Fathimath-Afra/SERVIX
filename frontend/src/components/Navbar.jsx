import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null; // Don't show navbar if not logged in

    return (
        <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-black text-blue-600 tracking-tighter">SERVIX</h1>
                
                <div className="flex gap-4 text-sm font-semibold text-gray-600">
                    {user.role === 'admin' && (
                        <>
                            <Link to="/dashboard" className="hover:text-blue-600">Home</Link>
                            <Link to="/admin/societies" className="hover:text-blue-600">Societies</Link>
                            <Link to="/admin/managers" className="hover:text-blue-600">Managers</Link>
                        </>
                    )}
                    {user.role === 'manager' && (
                        <>
                            <Link to="/manager/dashboard" className="hover:text-blue-600">Issues</Link>
                            <Link to="/manager/workers" className="hover:text-blue-600">My Workers</Link>
                        </>
                    )}
                    {user?.role === 'citizen' && (
                        <>
                            <Link to="/citizen/report-issue" className="...">Report Issue</Link>
                            <Link to="/citizen/my-issues" className="...">My Issues</Link>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase">
                    {user.role}
                </span>
                <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;