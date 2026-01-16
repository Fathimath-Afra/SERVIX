import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminSocieties = () => {
    const [societies, setSocieties] = useState([]);
    const [formData, setFormData] = useState({ name: '', address: '', city: '' });

    // Fetch societies on load
    const fetchSocieties = async () => {
        try {
            const { data } = await API.get('/societies');
            setSocieties(data);
        } catch (err) {
            console.error("Error fetching societies");
        }
    };

    useEffect(() => { fetchSocieties(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/societies', formData);
            setFormData({ name: '', address: '', city: '' }); // Clear form
            fetchSocieties(); // Refresh list
            alert("Society Added Successfully!");
        } catch (err) {
            alert("Error adding society");
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin: Society Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FORM COLUMN */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Add New Society</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                            type="text" placeholder="Society Name" required
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <input 
                            type="text" placeholder="Address" required
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                        <input 
                            type="text" placeholder="City" required
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                            Create Society
                        </button>
                    </form>
                </div>

                {/* LIST COLUMN */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Existing Societies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {societies.map(s => (
                            <div key={s._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-lg text-gray-800">{s.name}</h3>
                                <p className="text-gray-500 text-sm">{s.address}</p>
                                <p className="text-blue-500 text-xs font-semibold mt-2 uppercase">{s.city}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSocieties;