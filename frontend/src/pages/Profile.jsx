import { useEffect, useState } from 'react';
import API from '../api/axios';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/users/profile');
                setProfile(data);
            } catch (err) {
                console.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-10 text-center uppercase text-xs font-bold">Loading Profile...</div>;

    return (
        <div className="max-w-2xl mx-auto p-8 mt-10 font-sans">
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black w-fit pr-4">My Account</h1>

            <div className="bg-white border border-gray-200 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gray-50 p-8 border-b border-gray-200">
                    <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-black mb-4">
                        {profile?.name?.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">{profile?.name}</h2>
                    <span className="inline-block mt-1 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest">
                        {profile?.role}
                    </span>
                </div>

                {/* Info Section */}
                <div className="p-8 space-y-6">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                        <p className="text-gray-800 font-medium">{profile?.email}</p>
                    </div>

                    {profile?.societyId && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Linked Society</p>
                            <p className="text-gray-800 font-medium">{profile?.societyId.name}</p>
                            <p className="text-xs text-gray-500 uppercase">{profile?.societyId.address}, {profile?.societyId.city}</p>
                        </div>
                    )}

                    {profile?.role === 'worker' && (
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Earnings</p>
                            <p className="text-3xl font-black text-blue-600 mt-1">Rs. {profile?.walletBalance || 0}</p>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-center text-gray-400 text-[10px] font-bold uppercase mt-8 tracking-widest">
                Account ID: {profile?._id}
            </p>
        </div>
    );
};

export default Profile;