import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCitizenIssues } from '../store/issueSlice';

const MyIssues = () => {
    const dispatch = useDispatch();
    const { items: issues, loading } = useSelector(state => state.issues);

    useEffect(() => {
        dispatch(fetchCitizenIssues());
    }, [dispatch]);

    const getStatusStyle = (status) => {
        switch(status) {
            case 'resolved': return 'bg-green-100 text-green-700';
            case 'in-progress': return 'bg-blue-100 text-blue-700';
            case 'open': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="p-10 text-center">Loading your reports...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-black mb-8 text-gray-800">My Reported Issues</h1>

            <div className="space-y-4">
                {issues.length > 0 ? issues.map(issue => (
                    <div key={issue._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                        {/* Image Preview */}
                        {issue.images?.[0] && (
                            <img src={issue.images[0]} alt="issue" className="w-full md:w-32 h-32 object-cover rounded-xl" />
                        )}
                        
                        <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold text-gray-800">{issue.title}</h2>
                                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${getStatusStyle(issue.status)}`}>
                                    {issue.status}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4">{issue.description}</p>
                            
                            <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
                                <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                                <span>📂 {issue.category}</span>
                                {issue.assignedTo && (
                                    <span className="text-blue-600 font-bold">👤 Assigned to: {issue.assignedTo.name}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400">You haven't reported any issues yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyIssues;