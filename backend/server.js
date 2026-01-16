require('dotenv').config();
const configureDB = require('./config/db');
const cors = require('cors');
const authenticateUser = require('./app/Middlewares/authenticate_user');
const authorizeUser = require('./app/Middlewares/authorize_user');
const userCltr = require('./app/Controllers/userController');
const societyCltr = require('./app/Controllers/societyController')


const express =require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());


configureDB();


app.post('/api/register',userCltr.register);
app.post('/api/login',userCltr.login);


app.post('/api/societies', authenticateUser, authorizeUser(['admin']), societyCltr.create);
app.get('/api/societies', societyCltr.list); // Everyone needs to see societies to register

app.post('/api/admin/create-manager', authenticateUser, authorizeUser(['admin']), userCltr.createManager);
app.get('/api/admin/managers', authenticateUser, authorizeUser(['admin']), userCltr.listManagers);


app.post('/api/manager/create-worker', authenticateUser, authorizeUser(['manager']), userCltr.createWorker);
app.get('/api/manager/workers', authenticateUser, authorizeUser(['manager']), userCltr.listWorkersBySociety);


app.listen(port,() =>{
    console.log('server is running on port ',port);
})