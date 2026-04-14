import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardPage from '@/Components/UI/DashboardPage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Users, 
    CalendarCheck, 
    CheckSquare, 
    TrendingUp, 
    Clock, 
    MessageSquare,
    QrCode,
    ChevronRight,
    ArrowUpRight,
    Zap
} from 'lucide-react';

export default function MemberDashboard({ auth, tasks = [], stats = { todo: 0, in_progress: 0, done: 0 } }) {
    const [qr, setQr] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        
        fetch('/member/attendance/qr', { headers: { "Accept": "application/json" } })
            .then(res => res.json())
            .then(data => data.qr && setQr(data.qr))
            .catch(err => console.error("Error fetching QR:", err));

        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const formattedDate = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });

    return (
        <MemberLayout auth={auth}>
            <Head title="Member Dashboard" />

            <DashboardPage 
                title={`Good ${currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, ${auth.user.name.split(' ')[0]}!`}
                description="Ready to tackle your goals for today?"
                actions={
                    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-[#1F2BF3] uppercase tracking-widest">{formattedDate}</span>
                            <span className="text-lg font-black text-gray-900 dark:text-white leading-none">{formattedTime}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                }
            >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        title="To Do" 
                        value={stats.todo} 
                        icon={<CheckSquare className="w-6 h-6" />} 
                        gradient="from-amber-400 to-orange-500"
                        label="Tasks Pending"
                    />
                    <StatCard 
                        title="In Progress" 
                        value={stats.in_progress} 
                        icon={<TrendingUp className="w-6 h-6" />} 
                        gradient="from-blue-500 to-indigo-600"
                        label="Active Now"
                    />
                    <StatCard 
                        title="Completed" 
                        value={stats.done} 
                        icon={<Zap className="w-6 h-6" />} 
                        gradient="from-emerald-400 to-teal-500"
                        label="Finished Tasks"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Attendance Card */}
                    <DashboardCard className="relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <QrCode size={160} />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-[#1F2BF3]">
                                    <QrCode className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Smart Attendance</h3>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
                                <div className="flex-1 space-y-4">
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                        Mark your presence by scanning the secure dynamic QR code. 
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            Status: Available
                                        </div>
                                        <div className="text-xs font-medium text-gray-400">
                                            Last Activity: <span className="text-[#1F2BF3]">{auth?.user?.last_attendance_at || 'No logs today'}</span>
                                        </div>
                                    </div>
                                    <DashboardButton variant="primary" className="mt-4 w-full md:w-auto text-sm">
                                        View History
                                    </DashboardButton>
                                </div>
                                
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="p-5 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-blue-500/10 border border-gray-100 dark:border-gray-700 relative"
                                >
                                    {qr ? (
                                        <img src={`data:image/png;base64,${qr}`} alt="QR" className="w-32 h-32 dark:invert" />
                                    ) : (
                                        <div className="w-32 h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F2BF3]"></div>
                                        </div>
                                    )}
                                    <div className="absolute -top-2 -right-2 bg-[#1F2BF3] text-white p-2 rounded-xl shadow-lg">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </DashboardCard>

                    {/* Recent Tasks Card */}
                    <DashboardCard>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-500">
                                    <CheckSquare className="w-5 h-5" />
                                </div>
                                Priority Tasks
                            </h3>
                            <Link href="/member/tasks" className="text-xs font-black text-[#1F2BF3] hover:underline uppercase tracking-widest">See all</Link>
                        </div>

                        <div className="space-y-4">
                            {tasks.length > 0 ? tasks.slice(0, 4).map(task => (
                                <Link key={task.id} href={`/member/tasks/${task.id}/progress`}>
                                    <motion.div 
                                        whileHover={{ x: 8 }}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-[#1F2BF3]/5 transition-all border border-transparent hover:border-[#1F2BF3]/10 group"
                                    >
                                        <div className="flex items-center gap-4 truncate">
                                            <div className={`w-3 h-3 rounded-full shrink-0 ${
                                                task.priority === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                                                task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                                            }`} />
                                            <div className="truncate">
                                                <p className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors truncate">{task.title}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{task.project?.name || 'Personal'}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1F2BF3] transition-all shrink-0" />
                                    </motion.div>
                                </Link>
                            )) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-400 font-medium italic">Your slate is clear for now!</p>
                                </div>
                            )}
                        </div>
                    </DashboardCard>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <QuickAction icon={<Clock />} title="Attendance" link="/member/my-attendance" color="bg-blue-500" />
                    <QuickAction icon={<Users />} title="My Profile" link="/admin/profile" color="bg-purple-500" />
                    <QuickAction icon={<MessageSquare />} title="Chat Hub" link="/chat.index" color="bg-[#00D8C0]" />
                    <QuickAction icon={<TrendingUp />} title="My Progress" link="/member/progress" color="bg-indigo-500" />
                </div>
            </DashboardPage>
        </MemberLayout>
    );
}

function StatCard({ title, value, icon, gradient, label }) {
    return (
        <DashboardCard className="relative overflow-hidden border-none !p-0 shadow-lg">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.03] dark:opacity-[0.07]`} />
            <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl shadow-blue-500/20`}>
                        {icon}
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</span>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{title}</p>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: '65%' }} 
                            className={`h-full bg-gradient-to-r ${gradient}`}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{label}</span>
                </div>
            </div>
        </DashboardCard>
    );
}

function QuickAction({ icon, title, link, color }) {
    return (
        <Link href={link}>
            <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all flex flex-col items-center gap-4 group"
            >
                <div className={`p-4 rounded-2xl ${color} text-white shadow-lg group-hover:rotate-12 transition-transform`}>
                    {React.cloneElement(icon, { className: "w-6 h-6" })}
                </div>
                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight text-center">{title}</span>
            </motion.div>
        </Link>
    );
}
