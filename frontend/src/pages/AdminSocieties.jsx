import { useState, useEffect } from 'react';
import API from '../api/axios';
import { deleteConfirm, successAlert } from '../utils/alert';
import Swal from 'sweetalert2';

const AdminSocieties = () => {
    const [societies, setSocieties] = useState([]);
    const [formData, setFormData] = useState({ name: '', address: '', city: '' });

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
            setFormData({ name: '', address: '', city: '' });
            fetchSocieties();
            successAlert("Success!", "New society added.");
        } catch (err) {
            Swal.fire("Error", "Action failed.", "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await deleteConfirm("Delete Society?", "All linked data will be removed.");
        if (result.isConfirmed) {
            try {
                await API.delete(`/societies/${id}`);
                setSocieties(societies.filter(s => s._id !== id));
                successAlert("Deleted!", "Society removed.");
            } catch (err) {
                Swal.fire("Error", "Could not delete.", "error");
            }
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto font-sans">
            <h1 className="text-2xl font-bold mb-8 text-gray-800 uppercase tracking-tight border-b pb-2">Society Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* CREATE FORM */}
                <div className="bg-white p-6 border border-gray-200 h-fit">
                    <h2 className="text-sm font-bold mb-4 text-blue-600 uppercase">Add New Society</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Name" required className="w-full p-2 border border-gray-200 text-sm outline-none focus:border-blue-500"
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        <input type="text" placeholder="Address" required className="w-full p-2 border border-gray-200 text-sm outline-none focus:border-blue-500"
                            value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                        <input type="text" placeholder="City" required className="w-full p-2 border border-gray-200 text-sm outline-none focus:border-blue-500"
                            value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 text-sm font-bold hover:bg-blue-700">CREATE</button>
                    </form>
                </div>

                {/* LIST */}
                <div className="lg:col-span-2">
                    <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase">Existing Societies ({societies.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {societies.map(s => (
                            <div key={s._id} className="bg-white p-4 border border-gray-200 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900">{s.name}</h3>
                                    <p className="text-xs text-gray-500 uppercase">{s.city}</p>
                                </div>
                                <button onClick={() => handleDelete(s._id)} className="text-red-600 text-[10px] font-bold border border-red-100 px-2 py-1 hover:bg-red-50">DELETE</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSocieties;