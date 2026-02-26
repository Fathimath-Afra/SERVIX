import { useState } from 'react';
import { useGeolocation } from '../hooks/geolocation';
import { deleteConfirm, successAlert } from '../utils/alert';
import API from '../api/axios';
import Swal from "sweetalert2";

const ReportIssue = () => {
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('other');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState('');
    const [location, setLocation] = useState(null); 
    const [previews, setPreviews] = useState([]); // Stores blob URLs for preview
    const [isSearching, setIsSearching] = useState(false);
    
    // const { location, getMyLocation, error: locError } = useGeolocation();

    // 1. Image Preview Logic
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };

    // (Geocoding)
    const handleSearchAddress = async () => {
        if (!address) return Swal.fire("Input Required", "Please type an address first.", "info");
        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                Swal.fire("Location Found", 'Address coordinates have been locked.', "success");
            } else {
                Swal.fire("Not Found", "We couldn't find that address. Try adding a city name.", "error");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!location) return Swal.fire("Location Missing", "Please search for an address and click 'Find' first.", "warning");

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
            successAlert("Reported!", "Your issue has been submitted to the manager.");
            setTitle(''); setDescription(''); setCategory('other'); setImages([]);
            setPreviews([]); setAddress(''); setLocation(null);
        } catch (err) {
            Swal.fire("Failed", "Please try again later", "error");
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
                     <option value="cleaning">Cleaning</option>
                    <option value="other">Other</option>
                </select>

                <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} required
                    className="w-full p-3 border rounded-xl h-24" />

                 {/* 📍 ADDRESS SEARCH */}
                <div className="p-4 bg-gray-50 border border-gray-200">
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Issue Location (Address)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="e.g. Block B, Near Elevator..."
                            className="flex-grow p-2 border border-gray-300 text-sm outline-none bg-white focus:border-black"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <button 
                            type="button" 
                            onClick={handleSearchAddress}
                            className={`px-4 py-2 text-xs font-bold uppercase transition-all ${
                                location ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                            }`}
                            disabled={isSearching}
                        >
                            {isSearching ? '...' : location ? 'Found' : 'Find'}
                        </button>
                    </div>
                    {location && <p className="text-[9px] text-green-600 font-bold mt-1 uppercase tracking-widest">✓ Geocode Locked</p>}
                </div>


                <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Evidence Photos</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} 
                        className="text-[10px] text-gray-500 block w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-100 file:text-gray-700 file:font-bold file:uppercase hover:file:bg-gray-200 cursor-pointer" />
                    
                    {/* PREVIEW GRID */}
                    <div className="grid grid-cols-5 gap-2 mt-4">
                        {previews.map((url, index) => (
                            <div key={index} className="relative aspect-square border border-gray-100 overflow-hidden">
                                <img src={url} alt="preview" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className={`w-full py-4 text-sm font-black uppercase tracking-[0.2em] transition-all ${
                        loading ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {loading ? "Processing..." : "Submit Report"}
                </button>
            </form>
        </div>
    );
};

export default ReportIssue;