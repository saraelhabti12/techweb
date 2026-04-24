import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    UserCheck, 
    UserMinus, 
    Clock, 
    Search, 
    Calendar,
    Activity,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';

export default function AttendanceDashboard({ auth, attendanceData, selectedDate, stats, liveFeed }) {
    const [date, setDate] = useState(selectedDate);
    const [search, setSearch] = useState('');

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        router.get(route('admin.members.attendance'), { date: newDate });
    };

    const filteredData = attendanceData.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout auth={auth}>
            <Head title="Attendance Dashboard" />

            <DashboardPage 
                title="Attendance Hub"
                description="Monitor team presence, analyze punctuality trends, and manage daily logs."
                actions={
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search members..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-xl text-sm focus:ring-[#1F2BF3] focus:border-[#1F2BF3] w-64 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <Calendar className="w-4 h-4 text-[#1F2BF3]" />
                            <input
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                                className="bg-transparent border-none p-0 text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer"
                            />
                        </div>
                    </div>
                }
            >
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatBox 
                        title="Total Members" 
                        value={stats.total} 
                        icon={<Users />} 
                        color="text-blue-500" 
                        bg="bg-blue-50 dark:bg-blue-900/20"
                    />
                    <StatBox 
                        title="Present Today" 
                        value={stats.present} 
                        icon={<UserCheck />} 
                        color="text-emerald-500" 
                        bg="bg-emerald-50 dark:bg-emerald-900/20"
                    />
                    <StatBox 
                        title="Absent" 
                        value={stats.absent} 
                        icon={<UserMinus />} 
                        color="text-rose-500" 
                        bg="bg-rose-50 dark:bg-rose-900/20"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Table */}
                    <div className="lg:col-span-8">
                        <DashboardCard className="!p-0 overflow-hidden border-none shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Team Member</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Scan Time</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        <AnimatePresence>
                                            {filteredData.map((item) => (
                                                <motion.tr 
                                                    key={item.user_id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <img 
                                                                    src={item.avatar ? `/storage/${item.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1F2BF3&color=fff`} 
                                                                    alt={item.name}
                                                                    className="w-10 h-10 rounded-xl object-cover"
                                                                />
                                                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${item.status === 'Present' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                                                                <p className="text-[10px] font-medium text-gray-400">{item.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                                                            <Clock className="w-4 h-4 text-[#1F2BF3]" />
                                                            {item.time}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                            item.status === 'Present' 
                                                            ? 'bg-emerald-100 text-emerald-700' 
                                                            : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* Live Feed */}
                    <div className="lg:col-span-4 space-y-6">
                        <DashboardCard className="border-none shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Activity size={80} />
                            </div>
                            
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[#1F2BF3]" />
                                Live Activity Feed
                            </h3>

                            <div className="space-y-6">
                                {liveFeed.length > 0 ? liveFeed.map((log, idx) => (
                                    <motion.div 
                                        key={log.id}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex gap-4 group"
                                    >
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1F2BF3]">
                                                <UserCheck className="w-4 h-4" />
                                            </div>
                                            {idx !== liveFeed.length - 1 && (
                                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-100 dark:border-gray-800" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                                                <span className="text-[#1F2BF3]">{log.user_name}</span> {log.status}
                                            </p>
                                            <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider">{log.time}</p>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-8 text-gray-400 italic text-sm">
                                        No recent activity
                                    </div>
                                )}
                            </div>

                            <button className="w-full mt-8 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#1F2BF3] transition-colors flex items-center justify-center gap-2 group">
                                View Detailed Logs
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </DashboardCard>

                        {/* Summary Widget */}
                        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[#1F2BF3] to-[#7C3AED] text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80">Weekly Overview</h4>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-3xl font-black tracking-tight">94%</div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Attendance Rate</p>
                                </div>
                                <div className="h-12 w-24 flex items-end gap-1">
                                    {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                                        <div key={i} className="flex-1 bg-white/20 rounded-t-sm" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}

function StatBox({ title, value, icon, color, bg }) {
    return (
        <DashboardCard className="border-none shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${bg} ${color}`}>
                    {React.cloneElement(icon, { className: "w-6 h-6" })}
                </div>
            </div>
        </DashboardCard>
    );
}
