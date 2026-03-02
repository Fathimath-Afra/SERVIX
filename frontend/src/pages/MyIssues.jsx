import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    fetchCitizenIssues, 
    deleteIssueAction, 
    updateIssueAction 
} from "../store/issueSlice"; 
import API from "../api/axios";
import { deleteConfirm, successAlert } from "../utils/alert";
import Swal from "sweetalert2";
import UPIPaymentModal from "../components/UPIPaymentModal";

const MyIssues = () => {
  const dispatch = useDispatch();
  const { items: issues, loading , totalPages } = useSelector((state) => state.issues);
  
  // Review States
  const [selectedIssue, setSelectedIssue] = useState(null); 
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  // Edit States
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '', category: '' });

  const [showUPI, setShowUPI] = useState(false);
  const [activeIssue, setActiveIssue] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCitizenIssues(page));
  }, [dispatch , page]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-700";
      case "in-progress": return "bg-blue-100 text-blue-700";
      case "open": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // --- REVIEW HANDLERS ---
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", {
        issueId: selectedIssue,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      successAlert("Review Submitted!");
      setSelectedIssue(null);
      dispatch(fetchCitizenIssues());
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "Error submitting review", "error");
    }
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (id) => {
    const result = await deleteConfirm("Delete Report?", "This cannot be undone.");
    if (result.isConfirmed) {
        dispatch(deleteIssueAction(id));
        successAlert("Deleted", "Your report has been removed.");
    }
  };

  // --- UPDATE HANDLERS ---
  const startEditing = (issue) => {
    setEditId(issue._id);
    setEditData({ title: issue.title, description: issue.description, category: issue.category });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateIssueAction({ id: editId, formData: editData }));
    setEditId(null);
    successAlert("Updated", "Issue details changed.");
  };

 const handleUPISuccess = async (details) => {
    try {
        await API.post('/payments/verify', {
            transactionId: details.transactionId,
            workerId: activeIssue.assignedTo._id,
            amount: activeIssue.serviceCharge,
            issueId: activeIssue._id
        });
        setShowUPI(false);
        successAlert("Paid!", "Worker has received your payment via UPI.");
        dispatch(fetchCitizenIssues());
    } catch (err) {
        alert("Verification failed");
    }
};
  if (loading) return <div className="p-10 text-center">Loading your reports...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-gray-800 uppercase border-b-2 pb-2">My Reported Issues</h1>

      <div className="space-y-6">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <div key={issue._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              
              {editId === issue._id ? (
                /* --- EDIT MODE --- */
                <form onSubmit={handleUpdate} className="space-y-4">
                    <h2 className="text-sm font-bold text-blue-600 uppercase">Edit Issue Details</h2>
                    <input 
                        className="w-full p-3 border rounded-xl text-sm font-bold"
                        value={editData.title}
                        onChange={(e) => setEditData({...editData, title: e.target.value})}
                    />
                    <textarea 
                        className="w-full p-3 border rounded-xl text-sm h-24"
                        value={editData.description}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase">Save Changes</button>
                        <button type="button" onClick={() => setEditId(null)} className="text-gray-400 text-xs font-bold uppercase">Cancel</button>
                    </div>
                </form>
              ) : (
                /* --- VIEW MODE --- */
                <>
                  <div className="flex flex-col md:flex-row gap-6">
                    {issue.images?.[0] && (
                        <img src={issue.images[0]} alt="issue" className="w-full md:w-32 h-32 object-cover rounded-xl" />
                    )}

                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-gray-800 uppercase">{issue.title}</h2>
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${getStatusStyle(issue.status)}`}>
                                {issue.status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{issue.description}</p>

                        <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-400 uppercase">
                            <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                            <span>📂 {issue.category}</span>
                            {issue.assignedTo && (
                                <span className="text-blue-600">👤 Assigned to: {issue.assignedTo.name}</span>
                            )}
                        </div>
                    </div>
                  </div>
                  

                  {issue.status === 'resolved' && issue.paymentStatus === 'pending' && (
                  <div className="mt-4 p-4 border border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Service Bill</p>
                      <p className="text-xl font-black">Rs. {issue.serviceCharge}</p>
                    </div>
                    <button 
                      onClick={() => { setActiveIssue(issue); setShowUPI(true); }}
                      className="bg-blue-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-md"
                    >
                    Pay with UPI
                    </button>
                  </div>
                  )}

                  {showUPI && (
                    <UPIPaymentModal 
                    amount={activeIssue.serviceCharge} 
                    onSucess={handleUPISuccess}
                   onCancel={() => setShowUPI(false)}
                    />
                  )}

                  {issue.paymentStatus === 'paid' ? (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 flex items-center gap-2">
                    <span className="text-green-600 text-lg font-bold">✓</span>
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">
                    Payment Settled to Worker Wallet
                    </p>
                </div>
                ) : issue.status === 'resolved' && (
                  <button onClick={() => handlePay(issue)}>
                    Pay Rs. {issue.serviceCharge}
                  </button>
                )}

                
                  {/* ACTION BUTTONS */}
                  <div className="mt-6 pt-4 border-t border-gray-50 flex gap-4 items-center">
                    {issue.status === "open" && (
                        <>
                            <button onClick={() => startEditing(issue)} className="text-blue-600 text-xs font-black uppercase hover:underline">Edit</button>
                            <button onClick={() => handleDelete(issue._id)} className="text-red-600 text-xs font-black uppercase hover:underline">Delete</button>
                        </>
                    )}

                    {issue.status === "resolved" && (
                        <button
                        onClick={() => setSelectedIssue(issue._id)}
                        className="bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-xl text-xs uppercase hover:bg-yellow-500"
                        >
                        ⭐ Rate Service
                        </button>
                    )}
                  </div>
                </>
              )}

              {/* REVIEW FORM MODAL-LIKE */}
              {selectedIssue === issue._id && (
                <div className="mt-4 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                  <h3 className="text-sm font-bold mb-4 uppercase text-yellow-800 tracking-tight">How was your experience?</h3>
                  <select
                    className="w-full p-2 border rounded-xl mb-3 text-sm bg-white"
                    onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                  <textarea
                    placeholder="Tell us about the service..."
                    className="w-full p-3 text-sm border rounded-xl mb-3 bg-white"
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleReviewSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase">Submit Review</button>
                    <button onClick={() => setSelectedIssue(null)} className="text-gray-400 text-xs font-bold uppercase">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold uppercase text-xs">No reports found.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-6 border-t pt-8">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-1 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 disabled:opacity-20 transition-all"
                    >
                        &larr; Previous
                    </button>
                    
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                        Page {page} of {totalPages}
                    </span>

                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-1 border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 disabled:opacity-20 transition-all"
                    >
                        Next &rarr;
                    </button>
                </div>
            )}
    </div>
  );
};

export default MyIssues;