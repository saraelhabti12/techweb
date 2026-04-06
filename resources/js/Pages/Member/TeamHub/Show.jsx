import React from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TeamHubShow() {
    const { activity, auth } = usePage().props;

    if (!activity) return <p>Loading...</p>;

    return (
        <MemberLayout auth={auth}>
            <div className="max-w-3xl mx-auto bg-gray-500 bg-opacity-30 dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-xl shadow-lg p-8 mt-8 mb-12">
                <div className="mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour
                </button>
                </div>
                
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300">
                        {activity.title}
                    </h1>
                    <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {activity.content}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                        Created by: <span className="font-medium text-gray-700 dark:text-gray-300">{activity.admin.name}</span>
                    </p>
                </div>

                {activity.files.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">📁 Attached Files</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {activity.files.map((file) => (
                                <a
                                    key={file.id}
                                    href={`/storage/${file.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block bg-gray-50 dark:bg-gray-700/40 rounded-xl overflow-hidden shadow hover:shadow-lg transition transform hover:-translate-y-1"
                                >
                                    <img
                                        src={`/storage/${file.file_path}`}
                                        alt={file.file_name}
                                        className="w-full h-48 object-cover group-hover:opacity-90 transition"
                                    />
                                    <div className="p-3 text-center">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                                            {file.file_name}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}


                {activity.messages.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">💬 Messages</h2>
                        <ul className="space-y-3">
                            {activity.messages.map((msg) => (
                                <li key={msg.id} className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg shadow-sm">
                                    <p className="text-gray-800 dark:text-gray-200">
                                        <span className="font-semibold text-purple-700 dark:text-purple-300">
                                            {msg.user.name}:
                                        </span>{' '}
                                        {msg.message}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}              
            </div>
        </MemberLayout>
    );
}



