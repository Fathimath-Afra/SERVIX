const Issue = require('../Models/issue');
const {createIssueValidation} = require('../Validations/issueValidation');
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
        
        // Multer uploads images to Cloudinary and returns the URLs in req.files
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const issue = new Issue({
            title,
            description,
            category,
            images: imageUrls,
            location: location || undefined,
            societyId: req.societyId, 
            createdBy: req.userId    
        });

        await issue.save();
        res.status(201).json({ message: "Issue reported successfully!", issue });
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
        const { status } = req.body;
        const { id } = req.params;

        const issue = await Issue.findOneAndUpdate(
            { _id: id, assignedTo: req.userId },
            { status },
            { new: true }
        ).populate('createdBy', 'name email');

        if (!issue) return res.status(404).json({ error: "Task not found" });

       
        if (status === 'resolved') {
            try {
                const message = `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #2563eb;">Issue Resolved!</h2>
                        <p>Hello <b>${issue.createdBy.name}</b>,</p>
                        <p>Great news! The issue you reported has been marked as <b>Resolved</b>.</p>
                        <hr />
                        <p><b>Issue Title:</b> ${issue.title}</p>
                        <p><b>Description:</b> ${issue.description}</p>
                        <hr />
                        <p>Thank you for using SERVIX to keep your society running smoothly.</p>
                        <p style="font-size: 12px; color: #777;">This is an automated notification from the SERVIX System.</p>
                    </div>
                `;

                await sendEmail({
                    email: issue.createdBy.email,
                    subject: `SERVIX: Issue Resolved - ${issue.title}`,
                    message: message,
                });
            } catch (mailErr) {
                console.error("Email could not be sent", mailErr);
            }
        }

        res.json({ message: `Status updated to ${status}`, issue });
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
};


// issues reported by the logged-in citizen
issueCltr.listByCitizen = async (req, res) => {
    try {
        const issues = await Issue.find({ createdBy: req.userId })
            .populate('assignedTo', 'name') 
            .sort({ createdAt: -1 });
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch your issues" });
    }
};

module.exports = issueCltr;