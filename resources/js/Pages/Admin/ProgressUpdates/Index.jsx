import React from 'react';
import { router ,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ auth, progressUpdates }) {
    return (
        <AdminLayout auth={auth} title="Progress Updates">
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour
                </button>
                </div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Member Progress Updates</h1>
                </div>

                {progressUpdates.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No progress updates found</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {progressUpdates.map(progress => (
                            <div key={progress.id} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                                <div className="p-5">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                            <span className="text-blue-600 dark:text-blue-300 font-medium">
                                                {progress.user?.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {progress.user?.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(progress.created_at).toLocaleString([], {
                                                    weekday: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: 'short',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {progress.type}
                                        </span>
                                    </div>

                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        {progress.task?.title}
                                    </h4>

                                    {progress.content && (
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
                                            {progress.content}
                                        </p>
                                    )}

                                    <div className="space-y-2">
                                        {progress.url && (
                                            <a
                                                href={progress.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                                View Link
                                            </a>
                                        )}

                                        {progress.file_path && (
                                            <a
                                                href={`/storage/${progress.file_path}`}
                                                download
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download File
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
