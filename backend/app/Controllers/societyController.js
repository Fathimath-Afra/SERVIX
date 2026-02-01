const Society = require('../Models/society');
const {societyValidation ,updateSocietyValidation}= require("../Validations/societyValidation");

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

/*
societyCltr.update = async(req , res) =>{
    try{
        const {value ,error} = await updateSocietyValidation.validate(req.body,{abortEarly:false});
        if(error){
            res.status(400).json(error);
        }
        const society = await Society.findByIdAndUpdate(req.params.id, value, { new: true });
        if(!society){
            return res.status(404).json({error:"no such society found"});
        }
        res.json(society);

    }catch(err){
        res.status(500).json({error:"error updating society"});
    }
}
*/


societyCltr.remove = async (req, res) => {
    try {
        await Society.findByIdAndDelete(req.params.id);
        res.json({ message: "Society deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
};
module.exports = societyCltr;