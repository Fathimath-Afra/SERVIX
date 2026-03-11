import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { deleteConfirm, successAlert } from '../utils/alert';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const AdminDashboard = () => {
     const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ societies: 0, managers: 0, citizens: 0, workers: 0 });
    const [users, setUsers] = useState([]);
    const [issues, setIssues] = useState([]);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [statsRes, usersRes, issuesRes, insightsRes] = await Promise.all([
                    API.get('/admin/system-stats'),
                    API.get('/admin/all-users'),   
                    API.get('/admin/all-issues'), 
                    API.get('/admin/ai-insights')
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setIssues(issuesRes.data);
                setInsights(insightsRes.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchAllData();
    }, []);

    const handleDeleteUser = async (id) => {
        const result = await deleteConfirm("Remove User?");
        if (result.isConfirmed) {
            await API.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            successAlert("Removed");
        }
    };

    const chartData = [
        { name: 'Societies', count: stats.societies, color: '#2563eb' },
        { name: 'Managers', count: stats.managers, color: '#1e293b' },
        { name: 'Citizens', count: stats.citizens, color: '#10b981' }, 
        { name: 'Workers', count: stats.workers, color: '#f59e0b' },   
    ];


    if (loading) return <div className="p-10 text-center font-bold uppercase text-xs">Loading System Analytics...</div>;

    return (
        <div className="max-w-7xl mx-auto p-8 font-sans min-h-screen">
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black w-fit pr-4">Admin Console</h1>

            {/*  TAB NAVIGATION */}
            <div className="flex gap-1 mb-10 bg-gray-100 p-1 w-fit rounded-lg">
                {['overview', 'users', 'issues'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            {/*  STAT CARDS */}
             {activeTab === 'overview' && (
                <div className="animate-in fade-in duration-500 space-y-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {chartData.map(item => (
                            <div key={item.name} className="border border-gray-100 p-6 bg-white">
                                <p className="text-[9px] font-black text-gray-400 uppercase">{item.name}</p>
                                <p className="text-4xl font-black" style={{ color: item.color }}>{item.count}</p>
                            </div>
                        ))}
                    </div>

                    {/*  CHARTS SECTION */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                
                    {/* Bar Chart */}
                    <div className="border border-gray-200 p-8 bg-white h-80 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-8 tracking-widest">Growth Metrics</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '0px', border: '1px solid #000', fontSize: '10px', fontWeight: 'bold' }} />
                                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div className="border border-gray-200 p-8 bg-white h-80 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-8 tracking-widest">Platform Distribution</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={chartData} 
                                    dataKey="count" 
                                    innerRadius={60} 
                                    outerRadius={85} 
                                    paddingAngle={5}
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="rect" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

             <div className="bg-black text-white p-8 border border-black shadow-xl">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-blue-400">Heuristic Strategic Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
                             <div><p className="text-gray-500 font-bold mb-1">Global Trend</p>{insights?.topIssue}</div>
                             <div><p className="text-gray-500 font-bold mb-1">Society Hotspot</p>{insights?.hotspot}</div>
                             <div><p className="text-gray-500 font-bold mb-1">Management Advice</p>{insights?.recommendation}</div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white border border-gray-200 animate-in slide-in-from-bottom-2">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[9px] font-black uppercase text-gray-400 border-b border-gray-200">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Society</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(u => (
                                <tr key={u._id} className="text-xs hover:bg-gray-50">
                                    <td className="p-4 font-bold uppercase">{u.name}</td>
                                    <td className="p-4"><span className="px-2 py-0.5 border text-[8px] font-bold uppercase">{u.role}</span></td>
                                    <td className="p-4 text-gray-400 uppercase">{u.societyId?.name || 'Global'}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 font-bold hover:underline">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- TAB 3: GLOBAL ISSUE LOG --- */}
            {activeTab === 'issues' && (
                <div className="bg-white border border-gray-200 animate-in slide-in-from-bottom-2">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[9px] font-black uppercase text-gray-400 border-b border-gray-200">
                            <tr>
                                <th className="p-4">Issue</th>
                                <th className="p-4">Society</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {issues.map(i => (
                                <tr key={i._id} className="text-xs hover:bg-gray-50">
                                    <td className="p-4 font-bold uppercase">{i.title}</td>
                                    <td className="p-4 text-gray-500">{i.societyId?.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 text-[8px] font-bold uppercase ${i.status === 'resolved' ? 'text-green-600 border border-green-100' : 'text-orange-600 border border-orange-100'}`}>
                                            {i.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-gray-300">#{i._id.slice(-6)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        
            

            {/* --- ACTION FOOTER --- */}
            <div className="mt-12 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-gray-100 pt-8">
                <div className="flex gap-4">
                    <Link to="/admin/societies" className="px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-100">Manage Societies</Link>
                    <Link to="/admin/managers" className="px-6 py-2 border border-black text-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition">Manage Staff</Link>
                </div>
                <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest">© SERVIX Infrastructure Protocol v1.0</p>
            </div>
        </div>        
    );
};

export default AdminDashboard;