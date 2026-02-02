import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ManagerOverview = ({ issues }) => {
    
    const statusData = [
        { name: 'Open', value: issues.filter(i => i.status === 'open').length },
        { name: 'In-Progress', value: issues.filter(i => i.status === 'in-progress').length },
        { name: 'Resolved', value: issues.filter(i => i.status === 'resolved').length },
    ];

    
    const categories = ["water", "electricity", "plumbing", "waste", "other"];
    const categoryData = categories.map(cat => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: issues.filter(i => i.category === cat).length
    }));

    const COLORS = ['#ef4444', '#3b82f6', '#22c55e'];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statusData.map((stat, idx) => (
                    <div key={stat.name} className="bg-white border border-gray-100 p-6 shadow-sm">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.name}</p>
                        <p className="text-3xl font-black mt-1" style={{ color: COLORS[idx] }}>{stat.value}</p>
                    </div>
                ))}
                <div className="bg-gray-900 border border-gray-900 p-6 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Reports</p>
                    <p className="text-3xl font-black mt-1 text-white">{issues.length}</p>
                </div>
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="bg-white p-6 border border-gray-100 h-80 shadow-sm">
                    <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-6 tracking-widest text-center">Status Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={statusData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-6 border border-gray-100 h-80 shadow-sm">
                    <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-6 tracking-widest text-center">Issues by Category</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <XAxis dataKey="name" fontSize={10} fontWeight="bold" />
                            <YAxis fontSize={10} />
                            <Tooltip cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="count" fill="#1e293b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ManagerOverview;