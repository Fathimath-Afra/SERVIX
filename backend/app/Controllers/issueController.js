const Issue = require('../Models/issue');
const {createIssueValidation} = require('../Validations/issueValidation');
const generateAIResolution = require('../../utils/aiSummarizer');
const sendEmail = require('../../utils/sendEmail');
const User = require('../Models/user'); 


const issueCltr = {};

issueCltr.reportIssue = async (req, res) => {
    try {

        const body =req.body;
        const {value ,error} = createIssueValidation.validate(body,{abortEarly :false});

        if (error) {

         return res.status(400).json({ error: error.details[0].message });
        }

        const { title, description, category, location } = value;
         const societyId = req.societyId;
        // console.log("1. Issue Category:", category);
        // console.log("2. Citizen Society ID:", req.societyId);


        const eligibleWorkers = await User.find({ 
            role: 'worker', 
            societyId,
            skills: { $in: [category]},
            isAvailable: true
        });

        // console.log("3. Found Workers with this skill:", eligibleWorkers.length);

        let assignedTo = null;
        let status = 'open';

        // if skilled workers exist ,finding the one with least busy
        if (eligibleWorkers.length > 0) {
            const workerStats = await Promise.all(eligibleWorkers.map(async (worker) => {
                const count = await Issue.countDocuments({ 
                    assignedTo: worker._id, 
                    status: { $ne: 'resolved' } 
                });
                return { worker, count };
            }));

            workerStats.sort((a, b) => a.count - b.count);
            assignedTo = workerStats[0].worker._id;
            status = 'assigned';
        } 
         console.log("4. Auto-assigning to ID:", assignedTo);
        
        // Multer uploads images to Cloudinary and returns the URLs in req.files
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const issue = new Issue({
            title,
            description,
            category,
            images: imageUrls,
            location: location || undefined,
            societyId: req.societyId, 
            createdBy: req.userId,
            assignedTo, // worker id or null
            status      // open or assigned  
        });

        await issue.save();
         const responseMsg = assignedTo 
            ? `Auto-assigned to a specialized worker.` 
            : `Issue reported. No specialized worker available; Manager notified.`;

        res.status(201).json({ message: responseMsg, issue });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to report issue" });
    }
};


issueCltr.listBySociety = async (req, res) => {
    try {
        // Findind all issues where societyId matches the manager's society
        const issues = await Issue.find({ societyId: req.societyId })
            .populate('createdBy', 'name') 
            .sort({ createdAt: -1 });
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch issues" });
    }
};


issueCltr.assignWorker = async (req, res) => {
    try {
        const { issueId, workerId } = req.body;

        const issue = await Issue.findOneAndUpdate(
            { _id: issueId, societyId: req.societyId }, 
            { 
                assignedTo: workerId, 
                status: 'in-progress' 
            },
            { new: true }
        ).populate('assignedTo', 'name');

        if (!issue) {
            return res.status(404).json({ error: "Issue not found or unauthorized" });
        }

        res.json({ message: "Worker assigned successfully", issue });
    } catch (err) {
        res.status(500).json({ error: "Assignment failed" });
    }
};


// all issues for particular worker
issueCltr.listMyTasks = async (req, res) => {
    try {
        const issues = await Issue.find({ assignedTo: req.userId })
            .populate('societyId', 'name address city') 
            .populate('createdBy', 'name phone')         
            .sort({ updatedAt: -1 });
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};


// updating status

issueCltr.updateStatus = async (req, res) => {
  try {
    const { status, workerNote ,amount} = req.body;
    const { id } = req.params;

    //(without updating)
    const existingIssue = await Issue.findOne({
      _id: id,
      assignedTo: req.userId
    }).populate('createdBy', 'name email');

    if (!existingIssue) {
      return res.status(404).json({ error: "Task not found" });
    }

     existingIssue.status = status;

     if (status === "resolved") {
        existingIssue.serviceCharge = Number(amount) || 0;
        existingIssue.paymentStatus = "pending";
     
    }

    await existingIssue.save();

     const updatedIssue = await Issue.findById(id)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name')
        .populate('societyId', 'name address');
    return res.status(200).json({
      message: `Status updated to ${status}`,
      issue: existingIssue, 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};

// issues reported by the logged-in citizen
issueCltr.listByCitizen = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 4; 
        const skip = (page - 1) * limit;

        const query = { createdBy: req.userId };

        const issues = await Issue.find(query)
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalIssues = await Issue.countDocuments(query);

        res.json({
            issues,
            totalPages: Math.ceil(totalIssues / limit),
            currentPage: page
        })
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch your issues" });
    }
};


issueCltr.remove = async (req, res) => {
    try {
        const issue = await Issue.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
        if (!issue) return res.status(404).json({ error: "Issue not found or unauthorized" });
        res.json({ message: "Issue removed" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
};


issueCltr.update = async (req, res) => {
    try {
        const issue = await Issue.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.userId },
            req.body,
            { new: true }
        );
        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
};

// search filter
issueCltr.listBySociety = async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = { societyId: req.societyId };

        if (status && status !== 'all') query.status = status;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        const issues = await Issue.find(query)
            .populate('createdBy', 'name')
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 });

        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = issueCltr;