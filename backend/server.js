require('dotenv').config();
const configureDB = require('./config/db');
const cors = require('cors');
const authenticateUser = require('./app/Middlewares/authenticate_user');
const authorizeUser = require('./app/Middlewares/authorize_user');
const userCltr = require('./app/Controllers/userController');
const societyCltr = require('./app/Controllers/societyController');
const issueCltr = require('./app/Controllers/issueController');
const reviewCltr = require('./app/Controllers/reviewController');
const { upload } = require('./config/cloudinary');


const express =require('express');
const issue = require('./app/Models/issue');
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174", /\.vercel\.app$/], // This allows any vercel domain
    credentials: true
}));


configureDB();


app.post('/api/register',userCltr.register);
app.post('/api/login',userCltr.login);
app.get('/api/users/profile',authenticateUser,userCltr.getProfile);
app.delete('/api/:id', authenticateUser, userCltr.remove);


app.post('/api/societies', authenticateUser, authorizeUser(['admin']), societyCltr.create);
// app.post('/api/societies', societyCltr.create);
app.get('/api/societies', societyCltr.list);
// app.put('/api/societies/:id', authenticateUser, authorizeUser(['admin']), societyCltr.update);
app.delete('/api/societies/:id', authenticateUser, authorizeUser(['admin']), societyCltr.remove);


app.post('/api/admin/create-manager', authenticateUser, authorizeUser(['admin']), userCltr.createManager);
app.get('/api/admin/managers', authenticateUser, authorizeUser(['admin']), userCltr.listManagers);


app.post('/api/manager/create-worker', authenticateUser, authorizeUser(['manager']), userCltr.createWorker);
app.get('/api/manager/workers', authenticateUser, authorizeUser(['manager']), userCltr.listWorkersBySociety);
app.put('/api/manager/update-worker/:id', authenticateUser, authorizeUser(['manager']), userCltr.updateWorker);
app.delete('/api/manager/delete-worker/:id',authenticateUser,authorizeUser(['manager']),userCltr.remove);


app.post('/api/citizen/report-issue', authenticateUser,authorizeUser(['citizen']),upload.array('images', 3), issueCltr.reportIssue );
app.get('/api/issues/society', authenticateUser, authorizeUser(['manager']), issueCltr.listBySociety);
app.put('/api/issues/assign-worker', authenticateUser, authorizeUser(['manager']), issueCltr.assignWorker);
app.get('/api/issues/my-tasks',authenticateUser,authorizeUser(['worker']),issueCltr.listMyTasks);
app.patch('/api/issues/:id/status', authenticateUser, authorizeUser(['worker']), issueCltr.updateStatus);
app.get('/api/issues/my-reports', authenticateUser, authorizeUser(['citizen']), issueCltr.listByCitizen);
app.put('/api/issue/:id',authenticateUser,authorizeUser(['citizen']),issueCltr.update);
app.delete('/api/issue/:id',authenticateUser,authorizeUser(['citizen','admin']),issueCltr.remove);
app.get('/api/issues/society', authenticateUser, authorizeUser(['manager']), issueCltr.listBySociety);


app.post('/api/reviews', authenticateUser, authorizeUser(['citizen']), reviewCltr.create);


app.listen(port,() =>{
    console.log('server is running on port ',port);
})