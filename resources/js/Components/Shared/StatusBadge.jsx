export default function StatusBadge({ status }) {
    const statusClasses = {
        not_started: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        in_progress: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
        completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    };

    const statusText = {
        not_started: 'Not Started',
        in_progress: 'In Progress',
        completed: 'Completed',
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
            {statusText[status]}
        </span>
    );
}
