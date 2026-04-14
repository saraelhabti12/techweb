import AdminLayout from '@/Layouts/AdminLayout';
import {
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  ListBulletIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardPage from '@/Components/UI/DashboardPage';
import { motion } from 'framer-motion';

export default function AdminDashboard({ auth, stats, recentProjects, recentTasks, taskTrendData, upcomingDeadlines, teamActivity, filters = {} }) {
    const [dateFilters, setDateFilters] = useState({
        year: filters.year || '',
        month: filters.month || '',
        day: filters.day || ''
    });

    const statusDistributionData = [
        { name: 'To Do', value: stats.todo, color: '#F59E0B' },
        { name: 'In Progress', value: stats.in_progress, color: '#3B82F6' },
        { name: 'Completed', value: stats.done, color: '#10B981' },
    ];

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...dateFilters, [filterType]: value };
        setDateFilters(newFilters);
        
        const params = {};
        if (newFilters.year) params.year = newFilters.year;
        if (newFilters.month) params.month = newFilters.month;
        if (newFilters.day) params.day = newFilters.day;
        
        router.get(route('admin.dashboard'), params, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setDateFilters({ year: '', month: '', day: '' });
        router.get(route('admin.dashboard'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; 

    const yearOptions = Array.from({ length: 6 }, (_, i) => (currentYear - 2 + i).toString());
    const monthOptions = [
        { value: '1', label: 'Jan' }, { value: '2', label: 'Feb' }, { value: '3', label: 'Mar' },
        { value: '4', label: 'Apr' }, { value: '5', label: 'May' }, { value: '6', label: 'Jun' },
        { value: '7', label: 'Jul' }, { value: '8', label: 'Aug' }, { value: '9', label: 'Sep' },
        { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' }
    ];

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title={`Welcome back, ${auth.user.name.split(' ')[0]}!`}
                description="Here's a premium overview of your platform's performance today."
                actions={
                    <div className="flex items-center gap-3">
                        <DashboardButton variant="secondary" onClick={clearFilters} className="text-xs py-2">
                            Clear Filters
                        </DashboardButton>
                        <Link href={route('admin.projects.create')}>
                            <DashboardButton className="text-xs py-2 flex items-center gap-2">
                                <PlusIcon className="w-4 h-4" />
                                New Project
                            </DashboardButton>
                        </Link>
                    </div>
                }
            >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Tasks"
                        value={stats.total_tasks}
                        icon={<ClipboardDocumentIcon className="w-6 h-6" />}
                        gradient="from-blue-500 to-indigo-600"
                    />
                    <StatCard
                        title="To Do"
                        value={stats.todo}
                        icon={<ClockIcon className="w-6 h-6" />}
                        gradient="from-amber-400 to-orange-500"
                    />
                    <StatCard
                        title="In Progress"
                        value={stats.in_progress}
                        icon={<ArrowPathIcon className="w-6 h-6" />}
                        gradient="from-cyan-400 to-blue-500"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.done}
                        icon={<CheckCircleIcon className="w-6 h-6" />}
                        gradient="from-emerald-400 to-teal-500"
                    />
                </div>

                {/* Filters & Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Filters Card */}
                    <DashboardCard className="lg:col-span-1 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <FunnelIcon className="w-5 h-5 text-[#1F2BF3]" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Smart Filters</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Year</label>
                                    <select
                                        value={dateFilters.year}
                                        onChange={(e) => handleFilterChange('year', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1F2BF3] dark:text-white"
                                    >
                                        <option value="">All Years</option>
                                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Month</label>
                                    <select
                                        value={dateFilters.month}
                                        onChange={(e) => handleFilterChange('month', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1F2BF3] dark:text-white"
                                    >
                                        <option value="">All Months</option>
                                        {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 p-4 bg-gradient-to-br from-[#1F2BF3]/10 to-[#00D8C0]/10 rounded-2xl border border-[#1F2BF3]/10">
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                <span className="font-bold text-[#1F2BF3]">Pro Tip:</span> Use filters to analyze task performance trends over specific periods.
                            </p>
                        </div>
                    </DashboardCard>

                    {/* Task Trend Area Chart */}
                    <DashboardCard className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <ChartBarIcon className="w-5 h-5 text-[#1F2BF3]" />
                                Productivity Trend
                            </h3>
                            <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">+12% vs last month</span>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={taskTrendData}>
                                    <defs>
                                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1F2BF3" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#1F2BF3" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="tasks" stroke="#1F2BF3" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Projects */}
                    <DashboardCard title="Recent Projects">
                         <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white">Active Projects</h3>
                            <Link href="/admin/projects" className="text-xs font-bold text-[#1F2BF3] hover:underline uppercase tracking-widest">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {recentProjects.map((project) => (
                                <motion.div key={project.id} whileHover={{ x: 5 }} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold text-gray-400 group-hover:text-[#1F2BF3] transition-colors">
                                            {project.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{project.name}</p>
                                            <p className="text-xs text-gray-500">{project.tasks_count} active tasks</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Deadline</p>
                                        <p className="text-xs font-medium text-gray-900 dark:text-gray-300">{new Date(project.end_date).toLocaleDateString()}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </DashboardCard>

                    {/* Upcoming Deadlines */}
                    <DashboardCard>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                                Critical Deadlines
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex flex-col items-center justify-center text-white shrink-0">
                                        <span className="text-[10px] font-bold uppercase leading-none">{new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className="text-sm font-black leading-none">{new Date(item.date).getDate()}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</p>
                                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Due in 2 days</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center py-10 text-gray-400 text-sm italic">No urgent deadlines detected</p>
                            )}
                        </div>
                    </DashboardCard>

                    {/* Team Activity */}
                    <DashboardCard>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <UsersIcon className="w-5 h-5 text-emerald-500" />
                                Live Activity
                            </h3>
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-800"></div>
                            <div className="space-y-6 relative">
                                {teamActivity.map((activity, index) => (
                                    <div key={index} className="flex gap-4 relative">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-950 border-2 border-[#1F2BF3] flex items-center justify-center text-[10px] font-bold text-[#1F2BF3] z-10 shrink-0">
                                            {activity.avatar}
                                        </div>
                                        <div className="pt-1 min-w-0">
                                            <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                                                <span className="font-bold">{activity.user}</span> {activity.action} 
                                                <span className="font-medium text-[#1F2BF3]"> "{activity.item}"</span>
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-medium mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DashboardCard>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon, gradient }) {
    return (
        <DashboardCard className="relative overflow-hidden group border-none !p-0">
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${gradient}`}></div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                        {icon}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{title}</span>
                        <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</span>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase">
                        <ChartBarIcon className="w-3 h-3" />
                        <span>Live Data</span>
                    </div>
                    <div className="w-16 h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: '70%' }} 
                            className={`h-full bg-gradient-to-r ${gradient}`}
                        />
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
}
