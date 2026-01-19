import { useState } from 'react';
import { useGeolocation } from '../hooks/geolocation';
import API from '../api/axios';

const ReportIssue = () => {
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('other');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const { location, getMyLocation, error: locError } = useGeolocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!location) return alert("Please capture your location.");

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('location[lat]', location.lat);
        formData.append('location[lng]', location.lng);
        
        images.forEach(img => formData.append('images', img));

        try {
            await API.post('/citizen/report-issue', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Issue Reported!");
            setTitle(''); setDescription(''); setCategory('other'); setImages([]);
        } catch (err) {
            alert("Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Report Issue</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required 
                    className="w-full p-3 border rounded-xl" />
                
                <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full p-3 border rounded-xl">
                    <option value="water">Water</option>
                    <option value="electricity">Electricity</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="waste">Waste</option>
                    <option value="other">Other</option>
                </select>

                <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} required
                    className="w-full p-3 border rounded-xl h-24" />

                <button type="button" onClick={getMyLocation} className="w-full py-2 bg-gray-100 rounded-xl font-bold text-blue-600">
                    {location ? "📍 Location Captured" : "📍 Capture Location"}
                </button>

                <input type="file" multiple onChange={(e) => setImages(Array.from(e.target.files))} 
                    className="w-full text-sm text-gray-500" />

                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                    {loading ? "Reporting..." : "Submit Issue"}
                </button>
            </form>
        </div>
    );
};

export default ReportIssue;