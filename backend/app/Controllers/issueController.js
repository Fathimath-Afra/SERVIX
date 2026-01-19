const Issue = require('../Models/issue');
const {createIssueValidation} = require('../Validations/issueValidation');

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

module.exports = issueCltr;