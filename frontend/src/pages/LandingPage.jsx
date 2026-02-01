import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard');
    }, [isAuthenticated, navigate]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 font-sans">
            <div className="border-b border-gray-200 pb-12">
                <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-tight">
                    SERVIX
                </h1>
                <p className="mt-4 text-xl text-gray-600 leading-relaxed">
                    A unified platform to manage residential society services. 
                    Report issues, track repairs, and coordinate maintenance in one place.
                </p>
                <div className="mt-8 flex gap-4">
                    <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded shadow-sm font-semibold hover:bg-blue-700">
                        Login to Account
                    </Link>
                    <Link to="/register" className="border border-gray-300 text-gray-700 px-6 py-2 rounded shadow-sm font-semibold hover:bg-gray-50">
                        Register as Resident
                    </Link>
                </div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase">Fast Reporting</h2>
                    <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                        Skip the phone calls. Snap a photo of any maintenance issue and submit it directly to the management office instantly.
                    </p>
                </div>
                <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase">Real-Time Updates</h2>
                    <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                        Track the status of your request from start to finish. Know exactly which worker is assigned and when the job is done.
                    </p>
                </div>
                <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase">Staff Rewards</h2>
                    <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                        Reward the hard work of your society staff. Send digital tips directly to workers for excellent service and fast repairs.
                    </p>
                </div>
            </div>

            <div className="mt-20 p-8 border border-gray-200 bg-gray-50 text-center">
                <h2 className="text-xl font-bold text-gray-900">Get Started with SERVIX</h2>
                <p className="text-gray-600 mt-2 text-sm">Create an account to begin managing your society issues effectively.</p>
                
            </div>
        </div>
    );
};

export default LandingPage;