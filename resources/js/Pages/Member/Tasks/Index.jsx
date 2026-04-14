import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import StatusBadge from '@/Components/Shared/StatusBadge';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';

export default function TasksIndex({ auth, tasks }) {
    return (
        <MemberLayout auth={auth}>
            <Head title="My Tasks" />

            <DashboardPage 
                title="My Tasks"
                description="View and update the progress of tasks assigned to you."
            >
                <div className="grid grid-cols-1 gap-4">
                    {tasks.length === 0 ? (
                        <div className="p-12 text-center bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <ClipboardList className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-400 font-medium italic">No tasks assigned yet. Enjoy your day!</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))
                    )}
                </div>
            </DashboardPage>
        </MemberLayout>
    );
}

const TaskItem = ({ task }) => {
    return (
        <Link href={route('member.tasks.progress', task.id)} className="block group">
            <DashboardCard className="!p-0 overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-800 group-hover:border-[#1F2BF3] group-hover:shadow-md group-hover:shadow-blue-500/10">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors">
                                {task.title}
                            </h3>
                            {task.status && <StatusBadge status={task.status} />}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                            {task.description || 'No description provided.'}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300">
                                Project: {task.project?.name || 'N/A'}
                            </span>
                            <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No deadline'}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 md:flex-col md:items-end border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-6 shrink-0">
                        <div className="flex flex-col items-start md:items-end">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Updates</span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1F2BF3] font-black text-lg shadow-inner">
                                {task.progress_updates_count || 0}
                            </div>
                        </div>
                        <span className="text-xs font-bold text-[#1F2BF3] group-hover:underline">Update Progress →</span>
                    </div>
                </div>
            </DashboardCard>
        </Link>
    );
};
