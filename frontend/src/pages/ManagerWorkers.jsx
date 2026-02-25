import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkers, createWorkerAction, deleteWorkerAction, updateWorkerAction } from '../store/workerSlice';
import { successAlert } from '../utils/alert';
import { workerSchema } from '../validations/yupSchemas'; 
import * as Yup from 'yup';


const ManagerWorkers = () => {[]
    const dispatch = useDispatch();
    const { items: workers, totalPages, loading } = useSelector(state => state.workers);
    const [page, setPage] = useState(1);
   const [search, setSearch] = useState("");
   const [errors, setErrors] = useState({});

    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(fetchWorkers({ search, page }));
        }, 500); // 500ms debounce
        return () => clearTimeout(delayDebounce);
    }, [page, search,dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await workerSchema.validate(formData, { abortEarly: false, context: { isEdit: !!editId } });
             setErrors({}); 
            if (editId) {
                //  UPDATE
                const result = await dispatch(updateWorkerAction({ id: editId, formData }));
                if (updateWorkerAction.fulfilled.match(result)) {
                    successAlert("Updated!", "Worker details changed.");
                    setEditId(null);
                    setFormData({ name: '', email: '', password: '', phone: '' });
                }
            } else {
                //  CREATE
                const result = await dispatch(createWorkerAction(formData));
                if (createWorkerAction.fulfilled.match(result)) {
                    setFormData({ name: '', email: '', password: '', phone: '' });
                    successAlert("Worker Added!");
                }
            }
        }catch(err){
            
        }
        
    };

    const handleStartEdit = (worker) => {
        setEditId(worker._id);
        setFormData({ 
            name: worker.name, 
            email: worker.email, 
            phone: worker.phone || '', 
            password: '' 
        });
        //  Scroll to top of form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        const result = await deleteConfirm("Remove Staff?", "This worker will no longer be available.");
        if (result.isConfirmed) {
            dispatch(deleteWorkerAction(id));
        }
    };


    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            <h1 className="text-3xl font-black mb-8 text-gray-800 uppercase tracking-tight border-b-4 border-black w-fit pr-4">Staff Directory</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* 1. DYNAMIC FORM COLUMN */}
                <div className={`p-6 border h-fit transition-all ${editId ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
                    <h2 className={`text-xs font-black mb-6 uppercase tracking-widest ${editId ? 'text-orange-600' : 'text-blue-600'}`}>
                        {editId ? 'Edit Profile' : 'New Enrollment'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input type="text" placeholder="Worker Name" className="w-full p-2 border border-gray-200 text-sm outline-none focus:border-black bg-white"
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase mt-1">{errors.name}</p>}
                        </div>
                        
                        <div>
                            <input type="email" placeholder="Email Address" className="w-full p-2 border border-gray-200 text-sm outline-none focus:border-black bg-white"
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            {errors.email && <p className="text-[9px] text-red-500 font-bold uppercase mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <input type="text" placeholder="Phone (10 digits)" className="w-full p-2 border border-gray-200 text-sm outline-none focus:border-black bg-white"
                                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            {errors.phone && <p className="text-[9px] text-red-500 font-bold uppercase mt-1">{errors.phone}</p>}
                        </div>

                        {!editId && (
                            <div>
                                <input type="password" placeholder="Create Password" className="w-full p-2 border border-gray-200 text-sm outline-none focus:border-black bg-white"
                                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                {errors.password && <p className="text-[9px] text-red-500 font-bold uppercase mt-1">{errors.password}</p>}
                            </div>
                        )}

                        <button type="submit" className={`w-full text-white py-2 text-[10px] font-black uppercase tracking-widest transition-all ${editId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {editId ? 'Apply Changes' : 'Register Staff'}
                        </button>

                        {editId && (
                            <button type="button" onClick={() => { setEditId(null); setFormData({name:'', email:'', phone:'', password:''}); }}
                                className="w-full text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-black">
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                {/* 2. LIST & SEARCH COLUMN */}
                <div className="lg:col-span-2">
                    
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <input 
                            type="text" placeholder="Search staff by name or email..."
                            className="w-full p-3 pl-10 border border-gray-200 text-sm outline-none focus:border-black transition-all"
                            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
                        />
                        <span className="absolute left-3 top-3 text-gray-300">🔍</span>
                    </div>

                    {/* Grid List */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${loading ? 'opacity-30' : 'opacity-100'}`}>
                        {workers.length > 0 ? (
                            workers.map(w => (
                                <div key={w._id} className="bg-white p-4 border border-gray-100 flex flex-col justify-between hover:border-black transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                                            {w.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm uppercase">{w.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{w.email}</p>
                                            <p className="text-[9px] text-blue-500 font-black mt-1">{w.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-4 mt-6 border-t pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleStartEdit(w)} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(w._id)} className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:underline">Remove</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border border-dashed border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                {loading ? "Syncing..." : "No Staff Members Found"}
                            </div>
                        )}
                    </div>

                    {/* 3. PAGINATION */}
                    {/* {totalPages > 1 && (
                        <div className="mt-12 flex justify-center items-center gap-4">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-1 border border-gray-200 text-[10px] font-bold uppercase hover:bg-gray-50 disabled:opacity-20">Prev</button>
                            <span className="text-[10px] font-black uppercase tracking-tighter">Page {page} of {totalPages}</span>
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-1 border border-gray-200 text-[10px] font-bold uppercase hover:bg-gray-50 disabled:opacity-20">Next</button>
                        </div>
                    )} */}

                    <div className="mt-12 flex justify-center items-center gap-4">
                        <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)} 
                        className="px-4 py-1 border border-gray-200 text-[10px] font-bold uppercase hover:bg-gray-50 disabled:opacity-20"
                        >
                        Prev
                        </button>

                        <span className="text-[10px] font-black uppercase tracking-tighter">
                         Page {page} of {totalPages || 1}
                        </span>

                        <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)} 
                        className="px-4 py-1 border border-gray-200 text-[10px] font-bold uppercase hover:bg-gray-50 disabled:opacity-20"
                        >
                        Next
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default ManagerWorkers;