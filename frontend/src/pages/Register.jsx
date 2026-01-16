import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
    const [societies, setSocieties] = useState([]);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', societyId: '', role: 'citizen'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSocieties = async () => {
            try {
                const { data } = await API.get('/societies'); // Make sure this route is public
                setSocieties(data);
            } catch (err) {
                console.error("Could not load societies");
            }
        };
        fetchSocieties();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/register', formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Join SERVIX</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded-xl"
                        onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    
                    <input type="email" placeholder="Email Address" required className="w-full p-3 border rounded-xl"
                        onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    
                    <input type="password" placeholder="Password (min 6)" required className="w-full p-3 border rounded-xl"
                        onChange={(e) => setFormData({...formData, password: e.target.value})} />

                    <input type="text" placeholder="Phone Number" required className="w-full p-3 border rounded-xl"
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} />

                    <select 
                        required 
                        className="w-full p-3 border rounded-xl bg-white"
                        onChange={(e) => setFormData({...formData, societyId: e.target.value})}
                    >
                        <option value="">Select Your Society</option>
                        {societies.map(s => (
                            <option key={s._id} value={s._id}>{s.name} - {s.city}</option>
                        ))}
                    </select>

                    <button type="submit" className="w-full bg-blue-600 text-blue py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        Register
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
};

