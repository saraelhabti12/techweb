import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TeamHubIndex() {
    const { activities = [], auth } = usePage().props;

    return (
        <MemberLayout auth={auth}>
            <div className='bg-purple-50 border border-purple-200 dark:bg-gray-800 shadow rounded-lg p-6'>
            
            <div className="mb-6">
            <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Retour
            </button>
            </div>
            <h1 className="text-2xl font-semibold mb-10 text-gray-900 dark:text-gray-200">
                TeamHub Activities
            </h1>

            {!activities || activities.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                    No activities assigned to you yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map(activity => (
                        <div
                            key={activity?.id || Math.random()}
                            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                                    {activity?.title || 'Untitled Activity'}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                    {activity?.content ? activity.content.substring(0, 100) + '...' : 'No description'}
                                </p>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                {activity?.id && (
                                    <Link
                                        href={route('member.teamhub.show', activity.id)}
                                        className="text-purple-600 dark:text-teal-400 hover:underline text-sm font-medium"
                                    >
                                        View Details
                                    </Link>
                                )}
                                <span className="text-xs text-gray-400">
                                    Files: {activity?.files?.length || 0}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </MemberLayout>
    );
}

