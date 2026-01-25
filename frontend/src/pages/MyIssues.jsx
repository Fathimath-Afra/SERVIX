import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCitizenIssues } from "../store/issueSlice";
import API from "../api/axios";

const MyIssues = () => {
  const dispatch = useDispatch();
  const { items: issues, loading } = useSelector((state) => state.issues);
  const [selectedIssue, setSelectedIssue] = useState(null); // Tracking which issue to review
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    dispatch(fetchCitizenIssues());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "open":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", {
        issueId: selectedIssue,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      alert("Review Submitted!");
      setSelectedIssue(null); // Close form
      dispatch(fetchCitizenIssues()); // Refresh list
    } catch (err) {
      alert(err.response?.data?.error || "Error submitting review");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading your reports...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-gray-800">
        My Reported Issues
      </h1>

      <div className="space-y-4">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6"
            >
              {/* Image Preview */}
              {issue.images?.[0] && (
                <img
                  src={issue.images[0]}
                  alt="issue"
                  className="w-full md:w-32 h-32 object-cover rounded-xl"
                />
              )}

              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    {issue.title}
                  </h2>
                  <span
                    className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${getStatusStyle(issue.status)}`}
                  >
                    {issue.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  {issue.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
                  <span>
                    📅 {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                  <span>📂 {issue.category}</span>
                  {issue.assignedTo && (
                    <span className="text-blue-600 font-bold">
                      👤 Assigned to: {issue.assignedTo.name}
                    </span>
                  )}
                </div>
              </div>

              {issue.status === "resolved" && (
                <button
                  onClick={() => setSelectedIssue(issue._id)}
                  className="self-start inline-flex items-center 
                    mt-20 text-[13px] 
                    bg-yellow-400 text-yellow-900 
                    font-semibold px-3 py-1.5 
                    rounded-lg hover:bg-yellow-500 
                    h-fit"
                >
                  Rate Service
                </button>
              )}

              {/* review form */}
              {selectedIssue === issue._id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-yellow-200">
                  <h3 className="text-sm font-bold mb-2">
                    How was the experience?
                  </h3>
                  <select
                    className="p-2 border rounded mb-2 text-sm"
                    onChange={(e) =>
                      setReviewData({ ...reviewData, rating: e.target.value })
                    }
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                  <textarea
                    placeholder="Optional comment..."
                    className="w-full p-2 text-sm border rounded mb-2"
                    onChange={(e) =>
                      setReviewData({ ...reviewData, comment: e.target.value })
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleReviewSubmit}
                      className="bg-blue-600 text-white px-4 py-1 rounded-lg text-xs font-bold"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setSelectedIssue(null)}
                      className="text-gray-500 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400">
              You haven't reported any issues yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;
