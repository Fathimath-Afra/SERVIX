const Review = require('../Models/review');
const Issue = require('../Models/issue');

const reviewCltr = {};


reviewCltr.create = async (req, res) => {
    try {
        const { issueId, rating, comment } = req.body;

        
        const issue = await Issue.findOne({ _id: issueId, createdBy: req.userId, status: 'resolved' });
        
        if (!issue) {
            return res.status(400).json({ error: "You can only review resolved issues reported by you." });
        }

        const review = new Review({
            issueId,
            rating,
            comment,
            citizenId: req.userId,
            workerId: issue.assignedTo // Automatically link the worker
        });

        await review.save();
        res.status(201).json({ message: "Review submitted! Thank you.", review });
    } catch (err) {
       
        res.status(500).json({ error: "Failed to submit review" });
    }
};



module.exports = reviewCltr;