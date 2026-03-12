require('dotenv').config();
const configureDB = require('./config/db');
const cors = require('cors');
const authenticateUser = require('./app/Middlewares/authenticate_user');
const authorizeUser = require('./app/Middlewares/authorize_user');
const userCltr = require('./app/Controllers/userController');
const societyCltr = require('./app/Controllers/societyController');
const issueCltr = require('./app/Controllers/issueController');
const reviewCltr = require('./app/Controllers/reviewController');
const paymentCltr = require('./app/Controllers/paymentController');
const analyticsCltr = require('./app/Controllers/analyticsController');
const { upload } = require('./config/cloudinary');
const multer = require('multer');

const storage = multer.memoryStorage();
const uploadMemory = multer({ storage });



const express =require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

const http = require('http'); 
const { Server } = require('socket.io');


app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174", /\.vercel\.app$/], // This allows any vercel domain
    credentials: true
}));


configureDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", /\.vercel\.app$/], // Allow local and deployed frontend
        methods: ["GET", "POST", "PATCH", "PUT"]
    }
});

app.set('socketio', io);

// Connection Logic
io.on('connection', (socket) => {
    console.log('⚡ New Connection:', socket.id);

    // Join a private room based on User ID
    socket.on('join_private_room', (userId) => {
        const roomId = String(userId);
        socket.join(roomId);
        console.log(` User ${roomId} joined their private stream.`);
    });

    socket.on('disconnect', () => {
        console.log(' User Disconnected');
    });

    socket.on('send_location', (data) => {
    // Ensure data looks like: { lat, lng, citizenId, issueId, workerName }
    io.to(String(data.citizenId)).emit('worker_moving', data);
    });
});

app.post('/api/register',userCltr.register);
app.post('/api/login',userCltr.login);
app.get('/api/users/profile',authenticateUser,userCltr.getProfile);
app.delete('/api/users/:id', authenticateUser,authorizeUser(['admin']), userCltr.remove);


app.post('/api/societies', authenticateUser, authorizeUser(['admin']), societyCltr.create);
// app.post('/api/societies', societyCltr.create);
app.get('/api/societies', societyCltr.list);
// app.put('/api/societies/:id', authenticateUser, authorizeUser(['admin']), societyCltr.update);
app.delete('/api/societies/:id', authenticateUser, authorizeUser(['admin']), societyCltr.remove);


app.post('/api/admin/create-manager', authenticateUser, authorizeUser(['admin']), userCltr.createManager);
app.get('/api/admin/managers', authenticateUser, authorizeUser(['admin']), userCltr.listManagers);
app.get('/api/admin/ai-insights',authenticateUser,authorizeUser(['admin']),analyticsCltr.getAdminInsights);
app.get('/api/admin/system-stats',authenticateUser,authorizeUser(['admin']),userCltr.getSystemStats);
app.get('/api/admin/all-users',authenticateUser,authorizeUser(['admin']),userCltr.getAllUsers);


app.post('/api/manager/create-worker', authenticateUser, authorizeUser(['manager']), userCltr.createWorker);
app.get('/api/manager/workers', authenticateUser, authorizeUser(['manager']), userCltr.listWorkersBySociety);
app.patch('/api/worker/toggle-availability', authenticateUser, authorizeUser(['worker']), userCltr.toggleAvailability);
app.put('/api/manager/update-worker/:id', authenticateUser, authorizeUser(['manager']), userCltr.updateWorker);
app.delete('/api/manager/delete-worker/:id',authenticateUser,authorizeUser(['manager']),userCltr.remove);


app.post('/api/citizen/report-issue', authenticateUser,authorizeUser(['citizen']),upload.array('images', 3), issueCltr.reportIssue );
app.post('/api/analyze-image', authenticateUser, uploadMemory.single('image'),issueCltr.analzeImage);
app.get('/api/issues/society', authenticateUser, authorizeUser(['manager']), issueCltr.listBySociety);
app.put('/api/issues/assign-worker', authenticateUser, authorizeUser(['manager']), issueCltr.assignWorker);
app.get('/api/issues/my-tasks',authenticateUser,authorizeUser(['worker']),issueCltr.listMyTasks);
app.patch('/api/issues/:id/status', authenticateUser, authorizeUser(['worker']), issueCltr.updateStatus);
app.get('/api/issues/my-reports', authenticateUser, authorizeUser(['citizen']), issueCltr.listByCitizen);
app.put('/api/issue/:id',authenticateUser,authorizeUser(['citizen']),issueCltr.update);
app.delete('/api/issue/:id',authenticateUser,authorizeUser(['citizen','admin']),issueCltr.remove);
app.get('/api/issues/society', authenticateUser, authorizeUser(['manager']), issueCltr.listBySociety);
app.get('/api/admin/all-issues',authenticateUser,authorizeUser(['admin']),issueCltr.getAllIssues);


app.post('/api/reviews', authenticateUser, authorizeUser(['citizen']), reviewCltr.create);

app.post('/api/payments/verify',authenticateUser,authorizeUser(['citizen']), paymentCltr.verifyAndPay);


server.listen(port, () => {
    console.log(`SERVIX Backend & Real-time Engine running on port ${port}`);
});