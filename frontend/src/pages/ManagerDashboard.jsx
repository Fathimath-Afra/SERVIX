import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocietyIssues, assignWorkerAction } from '../store/issueSlice';
import { fetchWorkers } from '../store/workerSlice';
import { successAlert } from '../utils/alert';
import API from '../api/axios';
import Swal from 'sweetalert2'; 
import ManagerOverview from '../components/ManagerOverview'; 

const ManagerDashboard = () => {
    const dispatch = useDispatch();
    const { items: issues, loading,totalPages } = useSelector((state) => state.issues);
    const { items: workers, loading: workersLoading } = useSelector((state) => state.workers);
   
    const [activeTab, setActiveTab] = useState('overview');
    const [statusFilter, setStatusFilter] = useState('all'); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [selections, setSelections] = useState({});
    const [page ,setPage] = useState(1);

    // 1. Fetch Workers only once
    useEffect(() => {
       dispatch(fetchWorkers());
    }, []);

    // 2. BACKEND SEARCH & FILTER LOGIC (with Debounce)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(fetchSocietyIssues({ search: searchTerm, status: statusFilter ,page}));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter, page,dispatch]);

    const handleAssign = (issueId) => {
        const workerId = selections[issueId];
        if (!workerId) return Swal.fire("Oops", "Select a worker first", "info");
        dispatch(assignWorkerAction({ issueId, workerId }));
        successAlert("Assigned!");
    };

    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen font-sans">
            <h1 className="text-3xl font-black uppercase mb-6 tracking-tighter border-b-4 border-black w-fit pr-4">Manager Terminal</h1>

            {/* TAB SWITCHER */}
            <div className="flex gap-1 mb-10 bg-gray-100 p-1 w-fit rounded-lg">
                <button onClick={() => setActiveTab('overview')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-md ${activeTab === 'overview' ? 'bg-white text-black' : 'text-gray-400'}`}>Overview</button>
                <button onClick={() => setActiveTab('issues')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-md ${activeTab === 'issues' ? 'bg-white text-black' : 'text-gray-400'}`}>Issue Logs</button>
            </div>

            {activeTab === 'overview' ? (
                <ManagerOverview issues={issues} />
            ) : (
                <div className="animate-in slide-in-from-bottom-2 duration-500">
                    
                    {/* 🔍 SEARCH & FILTER BAR */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b pb-6">
                        <input 
                            type="text"
                            placeholder="Search title or category..."
                            className="w-full md:w-80 p-2 border border-gray-200 text-sm outline-none focus:border-black"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e)}
                        />

                        <div className="flex gap-2">
                            {['all', 'open', 'in-progress', 'resolved'].map(status => (
                                <button 
                                    key={status}
                                    onClick={() => handleFilterChange(status)}
                                    className={`px-4 py-1 text-[10px] font-bold uppercase border transition ${statusFilter === status ? 'bg-black text-white' : 'bg-white text-gray-400'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ISSUES GRID  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {issues.length > 0 ? issues.map((issue) => (
                                <div key={issue._id} className="bg-white border border-gray-200 p-6 flex flex-col">
                                    

                                <div className="flex justify-between mb-4">
                                    <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-1">{issue.category}</span>

                                     {issue.status === 'resolved' && (
                                     <span className={`text-[8px] font-black px-2 py-0.5 uppercase border w-fit ${
                                        issue.paymentStatus === 'paid' 
                                        ? 'bg-green-100 text-green-700 border-green-200' 
                                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    }`}>
                                    {issue.paymentStatus === 'paid' ? 'Settled' : 'Payment Pending'}
                                    </span>
                                    )}
                                    
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 ${issue.status === 'open' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{issue.status}</span>
                                </div>

                                <h2 className="text-lg font-bold mb-2 uppercase">{issue.title}</h2>
                                <p className="text-gray-500 text-sm mb-6 flex-grow">{issue.description}</p>

                                {issue.status === 'resolved' && (
                                    <div className="mb-4 p-2 bg-gray-50 border-l-4 border-gray-300">
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Service Charge</p>
                                        <p className="text-sm font-black text-gray-800">Rs. {issue.serviceCharge}</p>
                                    </div>
                                )}

                                <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-400 mb-4">
                                    Reported by: <span className="font-bold text-gray-700">{issue.createdBy?.name}</span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    {issue.status === 'open' ? (
                                        <div className="space-y-3">
                                            <select 
                                                className="w-full p-2 bg-gray-50 border border-gray-100 text-sm outline-none"
                                                value={selections[issue._id] || ""}
                                                onChange={(e) => setSelections({...selections, [issue._id]: e.target.value})}
                                            >
                                                <option value="">Select a Worker</option>
                                                {workers.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                                            </select>
                                            <button onClick={() => handleAssign(issue._id)} className="w-full bg-blue-600 text-white font-bold py-2 text-sm hover:bg-blue-700">ASSIGN</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-100">
                                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-[10px] uppercase">{issue.assignedTo?.name?.charAt(0)}</div>
                                            <span className="text-xs font-semibold text-gray-600">Assigned to {issue.assignedTo?.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">No issues found matching your criteria.</div>
                        )}
                    </div>


                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center items-center gap-6 border-t pt-8">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-1 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white disabled:opacity-20 transition-all"
                            >
                                &larr; Prev
                            </button>
                            
                            <span className="text-[10px] font-black uppercase tracking-tighter">
                                Page {page} of {totalPages}
                            </span>

                            <button 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-1 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white disabled:opacity-20 transition-all"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;