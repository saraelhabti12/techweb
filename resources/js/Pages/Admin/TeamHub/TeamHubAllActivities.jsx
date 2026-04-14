import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardCard from '@/Components/UI/DashboardCard';
import { PencilIcon, TrashIcon, FolderIcon, EyeIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function TeamHubAllActivities({ activities = [] }) {
    if (!Array.isArray(activities)) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-500 font-bold uppercase tracking-widest text-xs">Error: Activities data is invalid</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {activities.length === 0 && (
                <div className="col-span-full py-20 text-center">
                    <p className="text-gray-400 font-medium italic">No activities found in the hub.</p>
                </div>
            )}
            {activities.map((activity) => (
                <DashboardCard key={activity?.id || Math.random()} className="group !p-0 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                        <div className="flex items-start justify-between">
                            <Link
                                href={activity?.id ? route('admin.teamhub.show', activity.id) : '#'}
                                className="font-bold text-xl text-gray-900 dark:text-white hover:text-[#1F2BF3] transition-colors line-clamp-2"
                            >
                                {activity?.title || 'Untitled Activity'}
                            </Link>
                            <div className="flex gap-1">
                                {activity?.id && (
                                    <>
                                        <Link href={route('admin.teamhub.edit', activity.id)}>
                                            <button className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => confirm('Delete this activity?') && router.delete(route('admin.teamhub.destroy', activity.id))}
                                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                            {activity?.content || 'No description available.'}
                        </p>
                    </div>

                    {/* Files Section */}
                    <div className="p-6 flex-1 bg-white dark:bg-gray-900/40">
                        <div className="flex items-center gap-2 mb-4">
                            <FolderIcon className="w-4 h-4 text-[#1F2BF3]" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Attached Media</h4>
                        </div>

                        {activity?.files && activity.files.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {activity.files.map((file) => (
                                    <div key={file.id} className="relative group/file rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                                        {file.file_path && file.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <div className="aspect-square">
                                                <img
                                                    src={`/storage/${file.file_path}`}
                                                    alt={file.file_name}
                                                    className="w-full h-full object-cover group-hover/file:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-square flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                                                <FolderIcon className="w-8 h-8 text-[#1F2BF3] opacity-30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/file:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                            <a href={`/storage/${file.file_path}`} target="_blank" className="p-2 bg-white rounded-lg text-gray-900 shadow-xl">
                                                <EyeIcon className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No files attached</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Footer */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                        <Link href={activity?.id ? route('admin.teamhub.show', activity.id) : '#'} className="w-full block text-center text-xs font-black text-[#1F2BF3] uppercase tracking-widest hover:tracking-[0.2em] transition-all py-1">
                            Full Details →
                        </Link>
                    </div>
                </DashboardCard>
            ))}
        </div>
    );
}
