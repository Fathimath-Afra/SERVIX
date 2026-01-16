const Society = require('../Models/society');
const societyValidation = require("../Validations/societyValidation");

const societyCltr = {};

societyCltr.create = async (req, res) => {
    try {
        const { error, value } = societyValidation.validate(req.body);
        if (error) {
        return res.status(400).json({ error: error.details[0].message });
        }


        const { name, address ,city } = value;
        const society = new Society({
            name,
            address,
            city,
            createdBy: req.userId // From authenticateUser middleware
        });
        await society.save();
        res.status(201).json(society);
    } catch (err) {
        res.status(500).json({ error: "Error creating society" });
    }
};

societyCltr.list = async (req, res) => {
    try {
        const societies = await Society.find().sort({ createdAt: -1 });
        res.json(societies);
    } catch (err) {
        res.status(500).json({ error: "Error fetching societies" });
    }
};

module.exports = societyCltr;