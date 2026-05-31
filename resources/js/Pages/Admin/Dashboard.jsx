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
import Avatar from '@/Components/UI/Avatar';
import TodoWidget from '@/Components/UI/TodoWidget';
import DashboardFilter from '@/Components/Admin/DashboardFilter';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard({ auth, stats, financialStats = {}, recentProjects, recentTasks, taskTrendData, upcomingDeadlines, teamActivity, membersStats = [], personalTodos = [], filters = {}, filterOptions = { years: [], months: [], days: [] } }) {
    const { t } = useTranslation();
    const hasPermission = (permission) => {
        const user = auth?.user;
        if (!user) return false;
        if (user.role === 'admin') return true;
        
        const userPermissions = user.permissions || [];
        const permsArray = Array.isArray(userPermissions) ? userPermissions : Object.values(userPermissions);
        return permsArray.some(p => typeof p === 'string' && p.toLowerCase() === permission.toLowerCase());
    };

    const handleFilterChange = (type, value) => {
        const newFilters = { 
            period: 'all', // Reset period when using specific filters
            year: filters.year,
            month: filters.month,
            day: filters.day,
            [type]: value 
        };
        
        router.get(route('admin.dashboard'), newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const statusDistributionData = [
        { name: 'To Do', value: stats.todo, color: '#F59E0B' },
        { name: 'In Progress', value: stats.in_progress, color: '#3B82F6' },
        { name: 'Completed', value: stats.completed, color: '#10B981' },
        { name: 'Blocked', value: stats.blocked, color: '#EF4444' },
    ];

    const getFullPeriodLabel = () => {
        if (filters.period && filters.period !== 'all') {
            return filters.period.replace('_', ' ');
        }
        if (filters.start_date) {
            return filters.start_date;
        }

        let label = "";
        if (filters.day && filters.day !== 'all') {
            label += filters.day + "s ";
        }
        if (filters.month && filters.month !== 'all') {
            const m = filterOptions.months.find(m => m.id == filters.month);
            label += (m ? m.name : "") + " ";
        }
        if (filters.year && filters.year !== 'all') {
            label += filters.year;
        } else if (!label) {
            label = t('all_time');
        }
        return label.trim();
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title={t('welcome_back', { name: auth.user.name.split(' ')[0] })}
                description={t('performance_overview', { period: getFullPeriodLabel() })}
                actions={
                    <div className="flex items-center gap-3">
                        {hasPermission('create projects') && (
                            <Link href={route('admin.projects.create')}>
                                <DashboardButton className="text-xs py-2 flex items-center gap-2">
                                    <PlusIcon className="w-4 h-4" />
                                    {t('add_project')}
                                </DashboardButton>
                            </Link>
                        )}
                    </div>
                }
            >
                {/* Premium Filter Section */}
                <DashboardFilter filters={filters} filterOptions={filterOptions} />

                {/* Financial Overview Cards */}
                {(hasPermission('view finance') || hasPermission('view invoices') || hasPermission('view quotes')) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {hasPermission('view invoices') && (
                            <div onClick={() => router.visit(route('admin.invoices.index'))} className="cursor-pointer">
                                <StatCard
                                    title={t('unpaid_invoices_title')}
                                    value={financialStats.unpaid_invoices}
                                    icon={<ExclamationTriangleIcon className="w-6 h-6" />}
                                    gradient="from-rose-500 to-pink-600"
                                />
                            </div>
                        )}
                        {hasPermission('view finance') && (
                            <>
                                <div onClick={() => router.visit(route('admin.invoices.index'))} className="cursor-pointer">
                                    <StatCard
                                        title={t('revenue_period_title', { period: getFullPeriodLabel() })}
                                        value={`${new Intl.NumberFormat('fr-MA').format(financialStats.revenue_period)} DH`}
                                        icon={<CheckCircleIcon className="w-6 h-6" />}
                                        gradient="from-emerald-500 to-teal-600"
                                    />
                                </div>
                                <div onClick={() => router.visit(route('admin.invoices.index'))} className="cursor-pointer">
                                    <StatCard
                                        title={t('lifetime_revenue_title')}
                                        value={`${new Intl.NumberFormat('fr-MA').format(financialStats.revenue_total)} DH`}
                                        icon={<ChartBarIcon className="w-6 h-6" />}
                                        gradient="from-indigo-500 to-blue-600"
                                    />
                                </div>
                            </>
                        )}
                        {hasPermission('view quotes') && (
                            <div onClick={() => router.visit(route('admin.quotations.index'))} className="cursor-pointer">
                                <StatCard
                                    title={t('quotations_pending_title')}
                                    value={financialStats.quotations_pending}
                                    icon={<ClockIcon className="w-6 h-6" />}
                                    gradient="from-amber-500 to-orange-600"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {hasPermission('view tasks') && (
                        <StatCard
                            title={t('new_tasks')}
                            value={stats.total_tasks}
                            icon={<ClipboardDocumentIcon className="w-6 h-6" />}
                            gradient="from-blue-500 to-indigo-600"
                        />
                    )}
                    {hasPermission('view projects') && (
                        <StatCard
                            title={t('new_projects')}
                            value={stats.projects_count}
                            icon={<ListBulletIcon className="w-6 h-6" />}
                            gradient="from-violet-500 to-purple-600"
                        />
                    )}
                    {hasPermission('view clients') && (
                        <StatCard
                            title={t('new_clients')}
                            value={stats.clients_count}
                            icon={<UsersIcon className="w-6 h-6" />}
                            gradient="from-orange-500 to-red-500"
                        />
                    )}
                    {hasPermission('view tasks') && (
                        <StatCard
                            title={t('completed_tasks')}
                            value={stats.completed}
                            icon={<CheckCircleIcon className="w-6 h-6" />}
                            gradient="from-emerald-400 to-teal-500"
                        />
                    )}
                </div>

                {/* Team Progress Section */}
                {hasPermission('view members') && (
                    <div className="mt-8">
                        <DashboardCard>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <UsersIcon className="w-5 h-5 text-[#1F2BF3]" />
                                    </div>
                                    {t('member_performance')}
                                </h3>
                                <Link href="/admin/members" className="text-xs font-bold text-[#1F2BF3] hover:underline uppercase tracking-widest">{t('manage_team')}</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {membersStats.map((member) => (
                                    <motion.div key={member.id} whileHover={{ y: -5 }} className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="relative">
                                                <Avatar user={member} size="md" className="ring-2 ring-[#1F2BF3]/10" />
                                                {member.total_tasks > 0 && (
                                                    <div className="absolute -top-1 -right-1 bg-[#1F2BF3] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                                                        {member.total_tasks}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-900 dark:text-white truncate">{member.name}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <ProgressItem label={t('todo')} value={member.todo_tasks} total={member.total_tasks} color="bg-amber-400" />
                                            <ProgressItem label={t('in_progress')} value={member.in_progress_tasks} total={member.total_tasks} color="bg-blue-500" />
                                            <ProgressItem label="Completed" value={member.completed_tasks} total={member.total_tasks} color="bg-emerald-500" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </DashboardCard>
                    </div>
                )}

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    {/* Todo Widget */}
                    <div className="lg:col-span-1">
                        <TodoWidget initialTodos={personalTodos} />
                    </div>

                    {/* Task Trend Area Chart */}
                    {hasPermission('view tasks') && (
                        <DashboardCard className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <ChartBarIcon className="w-5 h-5 text-[#1F2BF3]" />
                                    {t('productivity_trend')}
                                </h3>
                                <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">{t('plus_vs_last_month')}</span>
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
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Projects */}
                    {hasPermission('view projects') && (
                        <DashboardCard title={t('recent_projects_title')}>
                             <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white">{t('active_projects')}</h3>
                                <Link href="/admin/projects" className="text-xs font-bold text-[#1F2BF3] hover:underline uppercase tracking-widest">{t('view_all')}</Link>
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
                                                <p className="text-xs text-gray-500">{t('active_tasks_count', { count: project.tasks_count })}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t('deadline_label')}</p>
                                            <p className="text-xs font-medium text-gray-900 dark:text-gray-300">{new Date(project.end_date).toLocaleDateString()}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </DashboardCard>
                    )}

                    {/* Upcoming Deadlines */}
                    {hasPermission('view tasks') && (
                        <DashboardCard>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                                    {t('critical_deadlines')}
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
                                            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">{t('due_in_2_days')}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center py-10 text-gray-400 text-sm italic">{t('no_urgent_deadlines')}</p>
                                )}
                            </div>
                        </DashboardCard>
                    )}

                    {/* Team Activity */}
                    {hasPermission('view members') && (
                        <DashboardCard>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <UsersIcon className="w-5 h-5 text-emerald-500" />
                                    {t('live_activity')}
                                </h3>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-800"></div>
                                <div className="space-y-6 relative">
                                    {teamActivity.map((activity, index) => (
                                        <div key={index} className="flex gap-4 relative">
                                            <Avatar user={activity.user_obj} size="sm" className="z-10 shrink-0 shadow-md ring-2 ring-white dark:ring-gray-900" />
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
                    )}
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}

function ProgressItem({ label, value, total, color }) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    
    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
                <span className="text-[10px] font-black text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-700">{value}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
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
                        <span>{useTranslation().t('live_data')}</span>
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
