import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkerTasks, updateIssueStatus } from '../store/issueSlice';
import MapOverview from '../components/MapOverview';
import API from '../api/axios';
import Swal from 'sweetalert2'; 
import { successAlert } from '../utils/alert';
import socket from '../api/scoket';

const WorkerDashboard = () => {
    const dispatch = useDispatch();
    const { items: tasks, loading } = useSelector(state => state.issues);
    const [profile, setProfile] = useState(null);
    const [view, setView] = useState('active'); // 'active' and 'completed'
    const [notes, setNotes] = useState({}); 
    const [serviceAmounts, setServiceAmounts] = useState({});


     const fetchFreshProfile = async () => {
            try {
                const { data } = await API.get('/users/profile');
                setProfile(data);
            } catch (err) { console.error(err); }
    };
    
    useEffect(() => {
        dispatch(fetchWorkerTasks());
       
        fetchFreshProfile();
    }, [dispatch]);

    
    useEffect(() => {
        let watchId;
    
    
        const activeTask = tasks.find(t => t.status === 'in-progress');

        if (activeTask) {

            navigator.geolocation.getCurrentPosition((pos) => {
            socket.emit('send_location', {
                issueId: activeTask._id,
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                workerName: profile?.name,
                citizenId: activeTask.createdBy 
            });
        });
            watchId = navigator.geolocation.watchPosition((pos) => {
          
                socket.emit('send_location', {
                    issueId: activeTask._id,
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    workerName: profile?.name,
                    citizenId: activeTask.createdBy._id 
                });
            }, (err) => console.error(err), { enableHighAccuracy: true });
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [tasks, profile]);

    const handleStatusUpdate = async (id, currentStatus) => {
        // console.log(id , currentStatus);
         console.log("Button clicked. ID:", id, "Current Status:", currentStatus);
        let nextStatus;
        if (currentStatus === 'assigned') {
            nextStatus = 'in-progress';
        } else if (currentStatus === 'in-progress') {
            nextStatus = 'resolved';
        }   
        if (!nextStatus) return;
        
        const workerNote = notes[id] || "";
        const amount = serviceAmounts[id] || "";

        if (nextStatus === 'resolved') {
            if (!workerNote) return Swal.fire("Note Required", "Describe the fix for the AI report.", "info");
            if (!amount) return Swal.fire("Amount Required", "Set a service charge for the citizen.", "info");
            
        }

        const result = await dispatch(updateIssueStatus({ 
            id, 
            status: nextStatus, 
            workerNote: nextStatus === 'resolved' ? workerNote : null ,
            amount: nextStatus === 'resolved' ? Number(amount) : null 
        }));

       
        if (updateIssueStatus.fulfilled.match(result)) {
            successAlert("Success", `Task is now ${nextStatus}`);
        } else {
            Swal.fire("Error", "Could not update status", "error");
        }
        if (nextStatus === 'resolved') fetchFreshProfile();
    };

    const toggleDuty = async () => {
    try {
        const { data } = await API.patch('/worker/toggle-availability');
        
        setProfile(prev => ({ ...prev, isAvailable: data.isAvailable }));
        
        successAlert(data.isAvailable ? "You are now ON DUTY" : "You are now OFF DUTY");
    } catch (err) {
        console.error("Status update failed");
    }
};

    if (loading) return <div className="p-10 text-center uppercase text-[10px] font-black tracking-widest">Syncing Tasks...</div>;

    // Filtered lists for the tabs
    const activeTasks = tasks.filter(t => t.status !== 'resolved');
    const completedTasks = tasks.filter(t => t.status === 'resolved');

    return (
        <div className="max-w-7xl mx-auto p-6 font-sans">
            
            <h1 className="text-2xl font-black uppercase mb-6 border-b pb-2 tracking-tight">Worker Console</h1>

            <div className="flex justify-between items-center bg-white border border-gray-200 p-4 mb-8">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${profile?.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        Current Status: {profile?.isAvailable ? 'Available' : 'Unavailable'}
                    </p>
                </div>
                <button 
                    onClick={toggleDuty}
                    className={`px-4 py-1 text-[10px] font-black uppercase border transition-all ${
                    profile?.isAvailable 
                    ? 'bg-white text-red-500 border-red-500 hover:bg-red-50' 
                    : 'bg-black text-white border-black'
                    }`}
                    >
                    {profile?.isAvailable ? 'Go Off Duty' : 'Go On Duty'}
                </button>
            </div>

            {/* --- TOP SECTION: MAP & STATS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2 border border-gray-200 h-[350px] overflow-hidden bg-gray-50">
                    
                    <MapOverview tasks={activeTasks} />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="border border-gray-200 p-8 bg-white flex flex-col justify-center h-full">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Earnings</p>
                        <p className="text-4xl font-black text-gray-900 mt-1">Rs. {profile?.walletBalance || 0}</p>
                        <div className="mt-6 flex items-center gap-2">
                             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                             <p className="text-[10px] text-gray-500 font-bold uppercase">Account Active</p>
                        </div>
                    </div>
                    
                    <div className="border border-gray-200 p-8 bg-gray-50 flex flex-col justify-center h-full">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Success Rate</p>
                        <p className="text-4xl font-black text-gray-900 mt-1">100%</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase">{completedTasks.length} Jobs Done</p>
                    </div>
                </div>
            </div>

            {/* --- TASK LIST SECTION --- */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-100">
                <div className="flex gap-8">
                    <button 
                        onClick={() => setView('active')}
                        className={`pb-2 text-xs font-black uppercase tracking-widest transition-all ${view === 'active' ? 'border-b-2 border-black text-black' : 'text-gray-300'}`}
                    >
                        Active Queue ({activeTasks.length})
                    </button>
                    <button 
                        onClick={() => setView('completed')}
                        className={`pb-2 text-xs font-black uppercase tracking-widest transition-all ${view === 'completed' ? 'border-b-2 border-black text-black' : 'text-gray-300'}`}
                    >
                        Completed ({completedTasks.length})
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(view === 'active' ? activeTasks : completedTasks).map(task => (
                    <div key={task._id} className={`border p-5 flex flex-col transition-all ${task.status === 'resolved' ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-black'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[9px] font-black bg-gray-100 px-2 py-1 uppercase">{task.category}</span>
                            <span className={`text-[9px] font-black px-2 py-1 uppercase ${task.status === 'resolved' ? 'bg-gray-200 text-gray-500' : 'bg-black text-white'}`}>
                                {task.status}
                            </span>
                        </div>
                        
                        <h3 className={`font-bold uppercase text-sm mb-2 ${task.status === 'resolved' ? 'text-gray-400' : 'text-gray-900'}`}>{task.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-6">{task.description}</p>

                        {task.status === 'in-progress' && (
                            <div className="mb-4">
                                <textarea 
                                    placeholder="Explain the fix (e.g., replaced wire)..."
                                    className="w-full p-2 text-[11px] border border-gray-200 outline-none focus:border-blue-400 h-16 resize-none"
                                    value={notes[task._id] || ""}
                                    onChange={(e) => setNotes({...notes, [task._id]: e.target.value})}
                                />
                                <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">AI will polish this note for the resident.</p>
                         

                            
                            <label className="text-[10px] font-black uppercase text-gray-400">Set Service Charge (Rs.)</label>
                            <input 
                                type="number"
                                placeholder="Enter amount..."
                                className="w-full p-2 border border-gray-200 outline-none font-bold"
                                value={serviceAmounts[task._id] || ""}
                                onChange={(e) => setServiceAmounts({...serviceAmounts,[task._id]: e.target.value})}
                            />
                            <button 
                                onClick={() => handleStatusUpdate(task._id, task.status)}
                                className="w-full bg-black text-white py-2 text-[10px] font-black uppercase"
                            >
                            Complete & Bill Citizen
                            </button>
                            </div>
                        )}

                        
                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">📍 {task.societyId?.name}</span>
                            {task.status !== 'resolved' && (
                                <button 
                                    onClick={() => handleStatusUpdate(task._id, task.status)}
                                     className={`text-[10px] font-black uppercase px-3 py-1 rounded transition-all ${
                                        task.status === 'assigned' 
                                        ? 'bg-black text-white hover:bg-gray-800' 
                                        : 'text-blue-600 hover:underline'
                                     }`}
                                >
                                    {task.status === 'assigned' ? '▶ Start Now' : '✅ Finish & Bill'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

               
                {(view === 'active' ? activeTasks : completedTasks).length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">
                        No records found in this section
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkerDashboard;