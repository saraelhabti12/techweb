import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia'; 

export default function TeamHubAllActivities({ activities = [] }) {
    const [messages, setMessages] = useState({});

    return (
        <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {activities.length === 0 && <p className="text-center text-gray-500">No activities available.</p>}
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="relative p-6 border border-gray-200 rounded-2xl shadow-sm bg-gray-100 bg-opacity-30 hover:shadow-md flex flex-col justify-between transition-shadow"
                >
                    <div className="absolute top-4 right-4 flex space-x-2">
                       <Link
                                href={route('admin.teamhub.edit', activity.id)}
                                className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition"
                            >
                                Edit
                        </Link>

                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this activity?')) {
                                    Inertia.delete(route('admin.teamhub.destroy', activity.id));
                                }
                            }}
                            className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition"
                        >
                            Delete
                        </button>
                    </div>
                    <div className="mb-4">
                        <Link
                            href={route('admin.teamhub.show', activity.id)}
                            className="font-bold text-xl text-purple-700 hover:text-purple-900 hover:underline  mt-4 block"
                        >
                            {activity.title}
                        </Link>
                        <p className="mt-2 text-gray-700">{activity.content}</p>
                    </div>
                    <div className="mt-2 w-full">
                        <h3 className="font-semibold mb-2 text-purple-600 text-center">Files</h3>

                        {activity.files && activity.files.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-xl bg-purple-50">
                                {activity.files.map((file) => (
                                    <div key={file.id} className="flex flex-col items-center border border-gray-300 p-1 rounded-lg">
                                        {file.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                            <img
                                                src={`/storage/${file.file_path}`}
                                                alt={file.file_name}
                                                className="h-24 w-full object-contain rounded-lg mb-1 transition-transform transform hover:scale-105"
                                            />
                                        )}
                                        <a
                                            href={`/storage/${file.file_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-purple-700 hover:text-purple-900 underline text-sm text-center break-words"
                                        >
                                            {file.file_name}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-24 border rounded-xl bg-purple-50 text-gray-500 text-sm">
                                No files
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

