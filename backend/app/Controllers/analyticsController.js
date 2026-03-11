const Issue = require('../Models/issue');
const generateMaintenanceInsights = require('../../utils/aiAnalysis');

const analyticsCltr = {};

analyticsCltr.getAdminInsights = async (req, res) => {
    try {
        
        const issues = await Issue.find().limit(100).select('category location title status');

      
        const summary = issues.map(i => `${i.category} at ${i.title}`).join(", ");

        
        const insights = await generateMaintenanceInsights(summary);

        res.json(insights);
    } catch (err) {
        res.status(500).json({ error: "Analytics failed" });
    }
};

module.exports = analyticsCltr;