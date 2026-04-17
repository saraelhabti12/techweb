export default function StatusBadge({ status }) {
    const statusClasses = {
        // Project Statuses
        active: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
        completed: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
        paused: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
        cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
        archived: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600',
        
        // Task Statuses (backward compatibility or separate task badge if needed)
        todo: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
        in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        completed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
        blocked: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
        done: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',

        // Old Project Statuses
        pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    };

    const statusText = {
        active: 'Active',
        completed: 'Completed',
        paused: 'Paused',
        cancelled: 'Cancelled',
        archived: 'Archived',
        todo: 'To Do',
        in_progress: 'In Progress',
        done: 'Done',
        pending: 'Pending',
        blocked: 'Blocked',
    };

    return (
        <span className={`px-3 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-lg ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
            {statusText[status] || status}
        </span>
    );
}
