const bcryptjs = require('bcryptjs');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const {registerValidation ,loginValidation} = require('../Validations/userValidation');
const userCltr = {};


// ----------USER REGISTER---------------------------
userCltr.register = async (req, res) => {
  try {
    const body = req.body;

    const { error, value } = registerValidation.validate(body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        errors: error.details.map(err => err.message)
      });
    }

    
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    
    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? "admin" : "citizen";

   
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(value.password, salt);

    const user = new User({
      name: value.name,
      email: value.email,
      password: hashedPassword,
      role: role,
      societyId: value.societyId || null
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      role: user.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// ------------------USER LOGIN----------------------
userCltr.login = async (req, res) => {
  try {
    const body = req.body;

    const { error, value } = loginValidation.validate(body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        errors: error.details.map(err => err.message)
      });
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordMatch = await bcryptjs.compare(
      value.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const tokenData = {
      userId: user._id,
      role: user.role,
      societyId: user.societyId
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};


// admin creates manager
userCltr.createManager = async (req, res) => {
    try {

         const { error, value } = registerValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }


        const { name, email, password, societyId } = value;

    
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already taken" });

      
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        
        const manager = new User({
            name,
            email,
            password: hashedPassword,
            role: 'manager',
            societyId 
        });

        await manager.save();
        res.status(201).json({ message: "Manager created successfully", manager });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};



//  list all managers (admin)
userCltr.listManagers = async (req, res) => {
    try {
        const managers = await User.find({ role: 'manager' }).populate('societyId', 'name');
        res.json(managers);
    } catch (err) {
        res.status(500).json({ error: "Error fetching managers" });
    }
};


// creating worker(manager)
userCltr.createWorker = async (req,res) =>{
  try{

    const { error, value } = registerValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const {name ,email, password} = value;
     const societyId = req.societyId; 

    const existingUser = await User.findOne({email});
    if (existingUser) return res.status(400).json({ error: "Email already taken" });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const worker = new User({
        name,
        email,
        password: hashedPassword,
        role: 'worker',
        societyId
    });

    await worker.save();
    res.status(201).json({ message: "Worker registered", worker });


  } catch(err){
    res.status(500).json({error :"error creating the worker"});
    console.log(err.message);
  }
}


userCltr.listWorkersBySociety = async (req, res) => {
    try {
        const workers = await User.find({ 
            role: 'worker', 
            $or: [
                { societyId: req.societyId }, // own staff
                { societyId: null }          // Global freelancers/External vendors
            ]
        }).select('-password');
        
        res.json(workers); 
    } catch (err) {
        res.status(500).json({ error: "Error fetching workers" });
    }
};

module.exports = userCltr;