import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';

export default function TasksIndex({ auth, tasks }) {
    return (
        <MemberLayout auth={auth}>
            <Head title="My Tasks" />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Tasks</h1>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                    {tasks.length === 0 && (
                        <div className="p-6 text-center text-gray-500">
                            No tasks assigned yet
                        </div>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}

const TaskItem = ({ task }) => {
    const statusColors = {
        todo: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
        in_progress: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
        done: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    };

    return (
        <Link
            href={route('member.tasks.progress', task.id)}
            className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">{task.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {task.project?.name} • Due: {task.due_date || 'No deadline'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {task.description || 'No description'}
                    </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <span className={`${statusColors[task.status]} text-xs px-3 py-1 rounded-full`}>
                        {task.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                        {task.progress_updates_count || 0} updates
                    </span>
                </div>
            </div>
        </Link>
    );
};
