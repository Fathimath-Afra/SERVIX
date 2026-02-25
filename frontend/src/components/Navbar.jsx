import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-[1000]">
            <div className="flex items-center gap-10">
                
                <Link to="/dashboard" className="text-2xl font-black text-blue-600 tracking-tighter">
                    SERVIX
                </Link>
                
                {/* ROLE-BASED LINKS */}
                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    
                    {/* Common link  */}
                    <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Home</Link>

                    {user?.role === 'admin' && (
                        <>
                            <Link to="/admin/societies" className="hover:text-blue-600 transition-colors">Societies</Link>
                            <Link to="/admin/managers" className="hover:text-blue-600 transition-colors">Managers</Link>
                        </>
                    )}

                    {user?.role === 'manager' && (
                        <>
                            <Link to="/manager/workers" className="hover:text-blue-600 transition-colors">My Workers</Link>
                        </>
                    )}

                    {user?.role === 'citizen' && (
                        <>
                            <Link to="/citizen/report-issue" className="hover:text-blue-600 transition-colors">Report Issue</Link>
                            <Link to="/citizen/my-issues" className="hover:text-blue-600 transition-colors text-blue-500">My Reports</Link>
                        </>
                    )}

                    {/* Dedicated link for the Profile page */}
                    <Link to="/profile" className="hover:text-blue-600 transition-colors">Profile</Link>
                </div>
            </div>

            {/* RIGHT SIDE: ROLE TAG & LOGOUT */}
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded">
                        {user?.role}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 lowercase">{user?.email?.split('@')[0]}</span>
                </div>
                
                <button 
                    onClick={handleLogout} 
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-100 px-3 py-1 hover:bg-red-50 transition-all"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;