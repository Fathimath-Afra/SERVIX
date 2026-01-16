import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminManagers = () => {
    const [societies, setSocieties] = useState([]);
    const [managers, setManagers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', societyId: '' });

    useEffect(() => {
        const fetchData = async () => {
            const societiesRes = await API.get('/societies');
            const managersRes = await API.get('/admin/managers'); 
            setSocieties(societiesRes.data);
            setManagers(managersRes.data);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/create-manager', formData);
            alert("Manager Created!");
            setFormData({ name: '', email: '', password: '', societyId: '' });
            // Refresh manager list
            const { data } = await API.get('/admin/managers');
            setManagers(data);
        } catch (err) {
            alert(err.response?.data?.error || "Error creating manager");
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin: Manage Managers</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FORM */}
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Add New Manager</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-xl" required
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        
                        <input type="email" placeholder="Email" className="w-full p-3 border rounded-xl" required
                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        
                        <input type="password" placeholder="Password" className="w-full p-3 border rounded-xl" required
                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />

                        <select className="w-full p-3 border rounded-xl bg-white" required
                            value={formData.societyId} onChange={(e) => setFormData({...formData, societyId: e.target.value})}>
                            <option value="">Select Society</option>
                            {societies.map(s => (
                                <option key={s._id} value={s._id}>{s.name} ({s.city})</option>
                            ))}
                        </select>

                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                            Register Manager
                        </button>
                    </form>
                </div>

                {/* LIST */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Existing Managers</h2>
                    <div className="overflow-hidden bg-white rounded-xl shadow border border-gray-100">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600 text-sm">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Society</th>
                                    <th className="p-4">Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {managers.map(m => (
                                    <tr key={m._id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-medium">{m.name}</td>
                                        <td className="p-4 text-blue-600 font-semibold">{m.societyId?.name || 'N/A'}</td>
                                        <td className="p-4 text-gray-500 text-sm">{m.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminManagers;