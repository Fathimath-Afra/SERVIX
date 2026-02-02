import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ societies: 0, managers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const socRes = await API.get('/societies');
                const manRes = await API.get('/admin/managers'); 
                setStats({ 
                    societies: socRes.data.length, 
                    managers: manRes.data.length 
                });
            } catch (err) { 
                console.error(err); 
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Data for Charts
    const chartData = [
        { name: 'Societies', count: stats.societies },
        { name: 'Managers', count: stats.managers },
    ];

    const COLORS = ['#2563eb', '#1e293b']; // Blue and Dark Slate

    if (loading) return <div className="p-10 text-center font-bold uppercase text-xs">Loading System Analytics...</div>;

    return (
        <div className="max-w-6xl mx-auto p-8 font-sans">
            <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-black w-fit pr-4">System Console</h1>
            
            {/* 📈 STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="border border-gray-200 p-8 bg-white hover:border-blue-500 transition-colors">
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total Registered Societies</p>
                    <h2 className="text-6xl font-black text-blue-600 mt-2">{stats.societies}</h2>
                    <Link to="/admin/societies" className="mt-6 inline-block text-xs font-black uppercase text-gray-800 hover:underline underline-offset-8 tracking-tighter">Manage Societies &rarr;</Link>
                </div>

                <div className="border border-gray-200 p-8 bg-white hover:border-black transition-colors">
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Active System Managers</p>
                    <h2 className="text-6xl font-black text-gray-900 mt-2">{stats.managers}</h2>
                    <Link to="/admin/managers" className="mt-6 inline-block text-xs font-black uppercase text-gray-800 hover:underline underline-offset-8 tracking-tighter">Manage Managers &rarr;</Link>
                </div>
            </div>

            {/* 📊 CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Bar Chart: Comparisons */}
                <div className="border border-gray-200 p-6 bg-white h-80">
                    <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-6 tracking-widest">Growth Metrics</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" fontSize={10} fontWeight="bold" />
                            <YAxis fontSize={10} />
                            <Tooltip cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="count" fill="#2563eb" barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart: Entity Ratio */}
                <div className="border border-gray-200 p-6 bg-white h-80">
                    <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-6 tracking-widest">Platform Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={chartData} 
                                dataKey="count" 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>

            <div className="mt-12 p-6 border border-dashed border-gray-200 text-center">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">All system data is monitored in real-time.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;