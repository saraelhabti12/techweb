import React from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';
import { 
    LinkIcon, 
    ArrowDownTrayIcon, 
    UserCircleIcon, 
    ClipboardDocumentCheckIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, progressUpdates }) {
    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Member Progress Updates"
                description="Monitor the latest work logs, link shares, and file uploads from your team members."
            >
                {progressUpdates.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <ClipboardDocumentCheckIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400 font-medium italic">No progress updates have been recorded yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {progressUpdates.map((progress, index) => (
                            <motion.div
                                key={progress.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <DashboardCard className="h-full flex flex-col !p-0 overflow-hidden border-transparent hover:border-[#1F2BF3]/20 transition-all">
                                    {/* Card Header */}
                                    <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                                                {progress.user?.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-gray-900 dark:text-white tracking-tight uppercase">{progress.user?.name}</h3>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {new Date(progress.created_at).toLocaleString([], {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-[#1F2BF3] text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100 dark:border-blue-800">
                                                {progress.type}
                                            </span>
                                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                                Task ID: #{progress.task_id}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="mt-1 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg shrink-0">
                                                <ClipboardDocumentCheckIcon className="w-4 h-4 text-[#1F2BF3]" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors leading-snug">
                                                {progress.task?.title || 'General Update'}
                                            </h4>
                                        </div>

                                        {progress.content && (
                                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 relative h-full">
                                                <ChatBubbleBottomCenterTextIcon className="absolute -top-2 -right-2 w-6 h-6 text-gray-200 dark:text-gray-700" />
                                                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line italic leading-relaxed">
                                                    "{progress.content}"
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-auto space-y-3 pt-4 border-t border-gray-50 dark:border-gray-800">
                                            {progress.url && (
                                                <a
                                                    href={progress.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all border border-blue-100/50"
                                                >
                                                    <LinkIcon className="w-5 h-5 shrink-0" />
                                                    <span className="text-xs font-black uppercase tracking-widest truncate">Review External Link</span>
                                                </a>
                                            )}

                                            {progress.file_path && (
                                                <a
                                                    href={`/storage/${progress.file_path}`}
                                                    download
                                                    className="flex items-center gap-3 p-3 rounded-xl bg-[#00D8C0]/10 dark:bg-[#00D8C0]/5 text-[#00D8C0] hover:bg-[#00D8C0]/20 transition-all border border-[#00D8C0]/20"
                                                >
                                                    <ArrowDownTrayIcon className="w-5 h-5 shrink-0" />
                                                    <span className="text-xs font-black uppercase tracking-widest truncate">Download Asset File</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </DashboardCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </DashboardPage>
        </AdminLayout>
    );
}
