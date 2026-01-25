import { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkerTasks, updateIssueStatus } from '../store/issueSlice';

const WorkerDashboard = () => {
    const dispatch = useDispatch();
    const { items: tasks, loading } = useSelector(state => state.issues);
    const [profile, setProfile] = useState(null);

    const fetchFreshProfile = async () => {
        try {
            const { data } = await API.get('/users/profile');
            setProfile(data);
        } catch (err) {
            console.error("Error fetching profile");
        }
    };


    useEffect(() => {
        dispatch(fetchWorkerTasks());
    }, [dispatch]);

    const handleStatusUpdate = (id, currentStatus) => {
        // console.log("Button Clicked for ID:", id); 
        // console.log("Current Status:", currentStatus);
        let nextStatus = "";
        if (currentStatus === 'open') nextStatus = 'in-progress';
        if (currentStatus === 'in-progress') nextStatus = 'resolved';

        // console.log("Next Status will be:", nextStatus);
        dispatch(updateIssueStatus({ id, status: nextStatus }));
        if (nextStatus === 'resolved') {
            fetchFreshProfile();
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Tasks...</div>;

    return (

        <div className="p-6 bg-gray-50 min-h-screen">
            {/* WALLET CARD */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center">
                    <div>
                        <p className="text-blue-100 font-semibold text-sm uppercase tracking-wider">My Earnings</p>
                        <h1 className="text-5xl font-black mt-2">
                            Rs.{profile?.walletBalance || 0}
                        </h1>
                        <p className="mt-4 text-xs opacity-80">
                            Base Fee: Rs.700 per resolved task
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-blue-500 p-4 rounded-2xl border border-blue-400">
                            <p className="text-xs font-bold">Tasks Completed</p>
                            <p className="text-2xl font-black">{tasks.filter(t => t.status === 'resolved').length}</p>
                        </div>
                    </div>
                </div>
            </div>


        
            <h1 className="text-2xl font-black mb-6">My Assigned Tasks</h1>
            
            <div className="space-y-4">
                {tasks.length > 0 ? tasks.map(task => (
                    <div key={task._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                {task.category}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                                task.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                                {task.status}
                            </span>
                        </div>

                        <h2 className="text-lg font-bold text-gray-800">{task.title}</h2>
                        <p className="text-sm text-gray-500 mb-4">{task.description}</p>

                        <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1 mb-4">
                            <p><strong>📍 Location:</strong> {task.societyId?.name}, {task.societyId?.address}</p>
                            <p><strong>👤 Resident:</strong> {task.createdBy?.name}</p>
                        </div>

                        {task.status !== 'resolved' && (
                            <button 
                                onClick={() => handleStatusUpdate(task._id, task.status)}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${
                                    task.status === 'in-progress' 
                                    ? 'bg-green-600 text-white hover:bg-green-700' 
                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                                }`}
                            >
                                {task.status === 'in-progress' ? '✅ Mark as Resolved' : '⚙️ Start Working'}
                            </button>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-20 text-gray-400">No tasks assigned yet. Enjoy your break!</div>
                )}
            </div>
        </div>
    );
};

export default WorkerDashboard;