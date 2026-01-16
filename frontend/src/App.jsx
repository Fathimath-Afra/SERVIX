import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminSocieties from './pages/AdminSocieties';
import AdminManagers from './pages/AdminManagers';
import ManagerWorkers from './pages/ManagerWorkers';
import Register from './pages/Register';
import Navbar from './components/Navbar';


const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div className="p-10 text-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-gray-600">You are logged in as: <span className="text-blue-600 font-bold uppercase">{user?.role}</span></p>
            <button 
                onClick={logout} 
                className="mt-6 bg-red-500 hover:bg-red-600 text-blue px-6 py-2 rounded-full font-bold transition-all"
            >
                Logout
            </button>
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/login" />} />

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

            <Route path="/manager/workers" element={
              <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerWorkers />
              </ProtectedRoute>
            } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;