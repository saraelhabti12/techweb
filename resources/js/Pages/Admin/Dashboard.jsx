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
  FunnelIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function AdminDashboard({ auth, stats, recentProjects, recentTasks, taskTrendData, upcomingDeadlines, teamActivity, filters = {} }) {
    const [dateFilters, setDateFilters] = useState({
        year: filters.year || '',
        month: filters.month || '',
        day: filters.day || ''
    });

    const statusDistributionData = [
        { name: 'To Do', value: stats.todo },
        { name: 'In Progress', value: stats.in_progress },
        { name: 'Completed', value: stats.done },
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
    const currentDay = now.getDate();

    const yearOptions = Array.from({ length: 11 }, (_, i) => {
        const year = currentYear - 5 + i;
        return {
            value: year.toString(),
            label: year.toString(),
            isCurrent: year === currentYear
        };
    });

    const monthOptions = [
        { value: '1', label: 'January', isCurrent: 1 === currentMonth },
        { value: '2', label: 'February', isCurrent: 2 === currentMonth },
        { value: '3', label: 'March', isCurrent: 3 === currentMonth },
        { value: '4', label: 'April', isCurrent: 4 === currentMonth },
        { value: '5', label: 'May', isCurrent: 5 === currentMonth },
        { value: '6', label: 'June', isCurrent: 6 === currentMonth },
        { value: '7', label: 'July', isCurrent: 7 === currentMonth },
        { value: '8', label: 'August', isCurrent: 8 === currentMonth },
        { value: '9', label: 'September', isCurrent: 9 === currentMonth },
        { value: '10', label: 'October', isCurrent: 10 === currentMonth },
        { value: '11', label: 'November', isCurrent: 11 === currentMonth },
        { value: '12', label: 'December', isCurrent: 12 === currentMonth }
    ];

    const generateDayOptions = () => {
        const year = parseInt(dateFilters.year) || currentYear;
        const month = parseInt(dateFilters.month) || currentMonth;
        
        const lastDay = new Date(year, month, 0);
        const daysInMonth = lastDay.getDate();
        
        const dayOptions = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dateForDay = new Date(year, month - 1, day);
            const dayName = dateForDay.toLocaleDateString('en-US', { weekday: 'long' });
            const isCurrentDay = year === currentYear && month === currentMonth && day === currentDay;
            
            dayOptions.push({
                value: day.toString(),
                label: `${dayName} ${day}`,
                isCurrent: isCurrentDay
            });
        }
        
        return dayOptions;
    };

    const dayOptions = generateDayOptions();

    return (
        <AdminLayout auth={auth} >
            <div className=" w-full h-screen rounded-xl p-6 mb-6 shadow-lg border border-purple-300/40">
            
                <div className="bg-purple-10/90  rounded-xl p-6 mb-6 shadow-lg border border-purple-300/40">
                    <h1 className="text-3xl font-bold text-black">
                        Welcome back, <span className="text-purple-600">{auth.user.name}!</span>
                    </h1>
                        <p className="mt-2 text-black text-sm ">
                            Here's what's happening with your projects today.
                        </p>
                </div>


    <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
            <div className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filter Tasks by Date</h3>
                    </div>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Clear Filters
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Year
                        </label>
                        <select
                            value={dateFilters.year}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        >
                            <option value="">All Years</option>
                            {yearOptions.map(year => (
                                <option 
                                    key={year.value} 
                                    value={year.value}
                                    className={year.isCurrent ? 'text-purple-600 font-semibold' : ''}
                                >
                                    {year.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Month
                        </label>
                        <select
                            value={dateFilters.month}
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        >
                            <option value="">All Months</option>
                            {monthOptions.map(month => (
                                <option 
                                    key={month.value} 
                                    value={month.value}
                                    className={month.isCurrent ? 'text-purple-600 font-semibold' : ''}
                                >
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Day
                        </label>
                        <select
                            value={dateFilters.day}
                            onChange={(e) => handleFilterChange('day', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        >
                            <option value="">All Days</option>
                            {dayOptions.map(day => (
                                <option 
                                    key={day.value} 
                                    value={day.value}
                                    className={day.isCurrent ? 'text-purple-600 font-semibold' : ''}
                                >
                                    {day.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {(dateFilters.year || dateFilters.month || dateFilters.day) && (
                    <div className="mt-4 p-3 bg-purple-500 dark:bg-purple-500 rounded-md">
                        <p className="text-sm text-white dark:text-white">
                            <strong>Active Filters:</strong> 
                            {dateFilters.year && ` Year: ${dateFilters.year}`}
                            {dateFilters.month && ` Month: ${monthOptions.find(m => m.value === dateFilters.month)?.label}`}
                            {dateFilters.day && ` Day: ${dateFilters.day}`}
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Tasks"
                    value={stats.total_tasks}
                    icon={<ClipboardDocumentIcon className="h-6 w-6 text-indigo-500" />}
                    className="border-l-4 border-indigo-500"
                />
                <StatCard
                    title="To Do"
                    value={stats.todo}
                    icon={<ClockIcon className="h-6 w-6 text-amber-500" />}
                    className="border-l-4 border-amber-500"
                />
                <StatCard
                    title="In Progress"
                    value={stats.in_progress}
                    icon={<ArrowPathIcon className="h-6 w-6 text-blue-500" />}
                    className="border-l-4 border-blue-500"
                />
                <StatCard
                    title="Completed"
                    value={stats.done}
                    icon={<CheckCircleIcon className="h-6 w-6 text-emerald-500" />}
                    className="border-l-4 border-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard
                    title="Task Trend (Last 6 Months)"
                    icon={<ChartBarIcon className="h-5 w-5 text-gray-400" />}
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={taskTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="tasks"
                                stroke="#8884d8"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="Task Status Distribution"
                    icon={<ListBulletIcon className="h-5 w-5 text-gray-400" />}
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statusDistributionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="value"
                                fill="#8884d8"
                                radius={[4, 4, 0, 0]}
                                label={{ position: 'top' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <RecentItems
                    title="Recent Projects"
                    items={recentProjects}
                    icon={<ListBulletIcon className="h-5 w-5 text-gray-400" />}
                    renderItem={(project) => (
                        <>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {project.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    End Date: {new Date(project.end_date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                                {project.tasks_count} tasks
                            </div>
                        </>
                    )}
                    link="/admin/projects"
                />

                <RecentItems
                    title="Recent Tasks"
                    items={recentTasks}
                    icon={<ClipboardDocumentIcon className="h-5 w-5 text-gray-400" />}
                    renderItem={(task) => (
                        <>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {task.title}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                    {task.project && (
                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
                                            {task.project.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    link="/admin/tasks"
                />

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="mr-3 p-1.5 rounded-md bg-gray-100 dark:bg-gray-700">
                                <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Upcoming Deadlines
                            </h3>
                        </div>
                        <a href="/admin/tasks?filter=upcoming" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                            View all
                        </a>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {upcomingDeadlines.map((item) => (
                            <div key={item.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                <div className="flex items-center">
                                    <div className="mr-3 p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                                        <CalendarIcon className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Due: {new Date(item.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {upcomingDeadlines.length === 0 && (
                            <div className="px-6 py-4 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="mr-3 p-1.5 rounded-md bg-gray-100 dark:bg-gray-700">
                            <UsersIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Team Activity
                        </h3>
                    </div>
                    <a href="/admin/activity" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                        View all activity
                    </a>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {teamActivity.length > 0 ? (
                            teamActivity.map((activity, index) => (
                                <ActivityItem
                                    key={index}
                                    user={activity.user}
                                    action={activity.action}
                                    item={activity.item}
                                    time={activity.time}
                                    avatar={activity.avatar}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                No recent activity
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon, className = '', trend, trendValue }) {
    const trendColor = trend === 'up' ? 'text-emerald-500' : 'text-rose-500';
    const trendIcon = trend === 'up' ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    );

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xs p-5 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {title}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                        {value}
                    </p>
                    {trend && (
                        <div className={`flex items-center text-xs mt-1 ${trendColor}`}>
                            {trendIcon}
                            <span className="ml-1">{trendValue} from last week</span>
                        </div>
                    )}
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function RecentItems({ title, items, icon, renderItem }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="mr-3 p-1.5 rounded-md bg-gray-100 dark:bg-gray-700">
                        {icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {title}
                    </h3>
                </div>
                <a href="#" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                    View all
                </a>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                    <div key={item.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 flex justify-between items-center">
                        {renderItem(item)}
                    </div>
                ))}
            </div>
            {items.length === 0 && (
                <div className="px-6 py-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No items found</p>
                </div>
            )}
        </div>
    );
}

function ChartCard({ title, icon, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <div className="mr-3 p-1.5 rounded-md bg-gray-100 dark:bg-gray-700">
                    {icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {title}
                </h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

function ActivityItem({ user, action, item, time, avatar }) {
    return (
        <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-medium text-sm">
                    {avatar}
                </div>
            </div>
            <div className="min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-medium">{user}</span> {action} <span className="font-medium">"{item}"</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {time}
                </p>
            </div>
        </div>
    );
}
