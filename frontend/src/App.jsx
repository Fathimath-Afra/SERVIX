import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminSocieties from './pages/AdminSocieties';
import AdminManagers from './pages/AdminManagers';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerWorkers from './pages/ManagerWorkers';
import ReportIssue from './pages/ReportIssue';
import WorkerDashboard from './pages/WorkerDashboard';
import MyIssues from './pages/MyIssues';
import Profile from './pages/Profile';

import Navbar from './components/Navbar';
import Footer from './components/Footer';


const DashboardRedirect = () => {
    const { user } = useContext(AuthContext);
    
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" />;
    if (user?.role === 'manager') return <Navigate to="/manager/dashboard" />;
    if (user?.role === 'worker') return <Navigate to="/worker/dashboard" />;
    if (user?.role === 'citizen') return <Navigate to="/citizen/my-issues" />;
    
    return <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
       
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route path="/profile" element={
              <ProtectedRoute>
                  <Profile />
              </ProtectedRoute>
              } />
              
              {/* --- SHARED DASHBOARD ROUTE */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardRedirect />
                </ProtectedRoute>
              } />

              
              <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                  </ProtectedRoute>
              } />
              <Route path="/admin/societies" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                      <AdminSocieties />
                  </ProtectedRoute>
                } />
              <Route path="/admin/managers" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                      <AdminManagers />
                  </ProtectedRoute>
                }/>

              {/* --- MANAGER ROUTES --- */}
              <Route path="/manager/dashboard" element={
                  <ProtectedRoute allowedRoles={['manager']}>
                      <ManagerDashboard />
                  </ProtectedRoute>
                } />
              <Route path="/manager/workers" element={
                  <ProtectedRoute allowedRoles={['manager']}>
                      <ManagerWorkers />
                  </ProtectedRoute>
                } />

              {/* --- CITIZEN ROUTES --- */}
              <Route path="/citizen/report-issue" element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                      <ReportIssue />
                  </ProtectedRoute>
                } />
              <Route path="/citizen/my-issues" element={
                  <ProtectedRoute allowedRoles={['citizen']}>
                      <MyIssues />
                  </ProtectedRoute>
                } />

              {/* --- WORKER ROUTES --- */}
              <Route path="/worker/dashboard" element={
                  <ProtectedRoute allowedRoles={['worker']}>
                      <WorkerDashboard />
                  </ProtectedRoute>
                } />

             
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;