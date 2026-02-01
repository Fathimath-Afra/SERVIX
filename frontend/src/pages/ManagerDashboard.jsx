import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocietyIssues, assignWorkerAction } from '../store/issueSlice';
import { deleteConfirm, successAlert } from '../utils/alert';
import API from '../api/axios';

const ManagerDashboard = () => {
    const dispatch = useDispatch();
    const { items: issues, loading } = useSelector((state) => state.issues);
    const [workers, setWorkers] = useState([]);

    const [selections, setSelections] = useState({});

    useEffect(() => {
        dispatch(fetchSocietyIssues());
        // Fetching workers in this society to populate the dropdowns
        const fetchWorkers = async () => {
            const { data } = await API.get('/manager/workers');
            setWorkers(data);
        };
        fetchWorkers();
    }, [dispatch]);


    const handleSelectWorker = (issueId, workerId) => {
        setSelections(prev => ({
            ...prev,
            [issueId]: workerId
        }));
    };

    const handleAssign = (issueId) => {
        const workerId = selections[issueId];
        if (!workerId) return Swal.fire("Oops", "Select a worker first", "info");

        dispatch(assignWorkerAction({ issueId, workerId }));
        successAlert("Assigned!", "The worker has been notified.");
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black mb-8">Society Issues</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map((issue) => (
                    <div key={issue._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
                        {/* Status Badges */}
                        <div className="flex justify-between mb-4">
                            <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                {issue.category}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                                issue.status === 'open' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                            }`}>
                                {issue.status}
                            </span>
                        </div>

                        <h2 className="text-xl font-bold mb-2">{issue.title}</h2>
                        <p className="text-gray-500 text-sm mb-6 flex-grow">{issue.description}</p>

                        {/* Assignment Logic */}
                        <div className="mt-auto pt-4 border-t border-gray-50">
                            {issue.status === 'open' ? (
                                <div className="space-y-3">
                                    <select 
                                        className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-blue-300"
                                        value={selections[issue._id] || ""}
                                        onChange={(e) => handleSelectWorker(issue._id, e.target.value)}
                                    >
                                        <option value="">Select a Worker</option>
                                        {workers.map(w => (
                                            <option key={w._id} value={w._id}>{w.name}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={() => handleAssign(issue._id)}
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                                    >
                                        Assign to Worker
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-xs uppercase">
                                        {issue.assignedTo?.name?.charAt(0) || 'W'}
                                    </div>
                                    <span className="text-sm font-semibold text-green-700">
                                        Assigned to {issue.assignedTo?.name || "a worker"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerDashboard;