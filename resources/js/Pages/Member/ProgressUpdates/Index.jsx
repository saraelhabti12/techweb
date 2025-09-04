import MemberLayout
 from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import { ClipboardDocumentListIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function ProgressUpdatesIndex({ auth, progressUpdates, status }) {
    return (
        <MemberLayout auth={auth}>
            <Head title="My Progress Updates" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Progress Updates</h1>
                        <Link
                            href={route('member.progress.create')}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Update
                        </Link>
                    </div>

                    {status && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                            {status}
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                        {progressUpdates.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                No progress updates found. Start by adding one!
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {progressUpdates.map((update) => (
                                    <li key={update.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-900 rounded-md">
                                                <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                        {update.task?.title || 'Task not found'}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(update.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                    {update.type === 'text' && (
                                                        <p>{update.content}</p>
                                                    )}
                                                    {update.type === 'file' && (
                                                        <a
                                                            href={`/storage/${update.file_path}`}
                                                            target="_blank"
                                                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                                        >
                                                            View attached file
                                                        </a>
                                                    )}
                                                    {update.type === 'link' && (
                                                        <a
                                                            href={update.url}
                                                            target="_blank"
                                                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                                        >
                                                            {update.url}
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex justify-end">
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this update?')) {
                                                                router.delete(route('member.progress-updates.destroy', update.id));
                                                            }
                                                        }}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}
