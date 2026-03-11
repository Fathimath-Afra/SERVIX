import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Swal from "sweetalert2";
import { registerSchema } from '../validations/yupSchemas';
import * as Yup from 'yup';

export default function Register() {
    const [societies, setSocieties] = useState([]);
    const [errors , setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', societyId: '', role: 'citizen'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSocieties = async () => {
            try {
                const { data } = await API.get('/societies'); 
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
            
            await registerSchema.validate(formData, { abortEarly: false });
            setErrors({}); 

            
            await API.post('/register', formData);
            
            Swal.fire({
                title: 'Successfully Registered!',
                text: 'Please login to continue to your dashboard.',
                icon: 'success',
                confirmButtonColor: '#2563eb'
            });
            navigate('/login');

        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const newErrors = {};
                err.inner.forEach(e => {
                    newErrors[e.path] = e.message;
                });
                setErrors(newErrors);
            } else {
                
                console.log(err.response?.data?.error);
                Swal.fire('Oops!!', err.response?.data?.error || "Registration failed", "error");
            }
        } 
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Join SERVIX</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded-xl"
                        onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">{errors.name}</p>}
                    
                    <input type="email" placeholder="Email Address" required className="w-full p-3 border rounded-xl"
                        onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">{errors.email}</p>}
                    
                    <input type="password" placeholder="Password (min 6)" required className="w-full p-3 border rounded-xl"
                        onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">{errors.password}</p>}

                    <input type="text" placeholder="Phone Number" required className="w-full p-3 border rounded-xl"
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">{errors.phone}</p>}

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

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all">
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

