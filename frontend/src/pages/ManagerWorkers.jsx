import { useState, useEffect } from 'react';
import API from '../api/axios';

const ManagerWorkers = () => {[]
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '',
        phone: '' 
    });

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/manager/workers');
            
            // ( backend had an error (like a 500 error or a 404), the data variable might have been an Object (e.g., { error: "Internal Server Error" }) instead of an Array )
            // that y verifying is it array or not
            if (Array.isArray(data)) {
                setWorkers(data);
            } else {
                setWorkers([]); 
            }
        } catch (err) {
            console.error("Error fetching workers:", err);
            setWorkers([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/manager/create-worker', formData);
            setFormData({ name: '', email: '', password: '', phone: '' });
            fetchWorkers();
            alert("Worker Added!");
        } catch (err) {
            alert(err.response?.data?.error || "Error adding worker");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Workers...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Society Workers</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* FORM */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Add Staff</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Worker Name" required
                            className="w-full p-3 border rounded-xl outline-none"
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        
                        <input type="email" placeholder="Email" required
                            className="w-full p-3 border rounded-xl outline-none"
                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        
                        <input type="password" placeholder="Password (min 6)" required minLength={6}
                            className="w-full p-3 border rounded-xl outline-none"
                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />

                        <input type="text" placeholder="Phone (10 digits)" required
                            className="w-full p-3 border rounded-xl outline-none"
                            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />

                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                            Add Worker
                        </button>
                    </form>
                </div>

                {/* WORKER LIST */}
                <div className="md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {workers.length > 0 ? (
                            workers.map(w => (
                                <div key={w._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold uppercase">
                                        {w.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{w.name}</h3>
                                        <p className="text-gray-500 text-sm">{w.email}</p>
                                        <p className="text-gray-400 text-xs">{w.phone}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center text-gray-400 py-10">
                                No workers found in your society yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerWorkers;