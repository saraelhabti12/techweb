import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    MagnifyingGlassIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardInput from '@/Components/UI/DashboardInput';
import StatusBadge from '@/Components/Shared/StatusBadge';
import { motion } from 'framer-motion';

import AdvancedFilterBar from '@/Components/Shared/AdvancedFilterBar';

export default function Index({ tasks, auth, filters = {}, filterOptions }) {
    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Tasks Management"
                description="Manage, assign, and track all tasks across your projects."
                actions={
                    <Link href={route('admin.tasks.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            New Task
                        </DashboardButton>
                    </Link>
                }
            >
                {/* Search & Filters */}
                <AdvancedFilterBar 
                    route="admin.tasks.index"
                    filters={filters}
                    filterOptions={filterOptions}
                    placeholder="Search tasks by title, description, project, or user..."
                />

                {/* Tasks Table */}
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Task Title</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Project</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Assigned To</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {tasks.map((task) => (
                                    <motion.tr 
                                        key={task.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <span className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors">
                                                {task.title}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {task.project?.name || 'No Project'}
                                                </span>
                                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-0.5">
                                                    {task.project?.client?.name || task.project?.client_name || 'Individual'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0">
                                                        {task.user?.name?.charAt(0) || (task.members && task.members[0]?.name?.charAt(0)) || '?'}
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                                                        {task.user?.name || (task.members && task.members[0]?.name) || 'Unassigned'}
                                                    </span>
                                                </div>
                                                {task.members && task.members.length > 1 && (
                                                    <span className="mt-1 text-[9px] font-black text-[#1F2BF3] uppercase tracking-widest flex items-center gap-1">
                                                        <span className="w-1 h-1 rounded-full bg-[#1F2BF3]" />
                                                        +{task.members.length - 1} more members
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {task.status ? <StatusBadge status={task.status} /> : (
                                                 <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400">
                                                    Unknown
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route('admin.tasks.show', task.id)}>
                                                    <button className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] hover:bg-[#1F2BF3] hover:text-white transition-all shadow-sm">
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={route('admin.tasks.edit', task.id)}>
                                                    <button className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => confirm("Delete this task?") && router.delete(route('admin.tasks.destroy', task.id))}
                                                    className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
