import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ClipboardDocumentListIcon, PlusIcon, TrashIcon, LinkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';

export default function ProgressUpdatesIndex({ auth, progressUpdates, status }) {
    return (
        <MemberLayout auth={auth}>
            <Head title="My Progress Updates" />

            <DashboardPage 
                title="Work Logs & Updates"
                description="Keep track of your submissions, resource links and task progress."
                actions={
                    <Link href={route('member.progress.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            Submit Update
                        </DashboardButton>
                    </Link>
                }
            >
                <div className="grid grid-cols-1 gap-6">
                    {progressUpdates.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-400 font-medium italic">You haven't submitted any progress updates yet.</p>
                        </div>
                    ) : (
                        progressUpdates.map((update, index) => (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <DashboardCard className="!p-0 overflow-hidden border-transparent hover:border-[#1F2BF3]/20 transition-all">
                                    <div className="p-6 flex flex-col md:flex-row gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1F2BF3] shrink-0">
                                            {update.type === 'link' ? <LinkIcon className="w-6 h-6" /> : 
                                             update.type === 'file' ? <DocumentIcon className="w-6 h-6" /> : 
                                             <ClipboardDocumentListIcon className="w-6 h-6" />}
                                        </div>
                                        
                                        <div className="flex-1 space-y-3">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                                                    {update.task?.title || 'General Activity'}
                                                </h3>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                                    {new Date(update.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                                {update.type === 'text' && (
                                                    <p className="whitespace-pre-line bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl italic border border-gray-100 dark:border-gray-800">
                                                        "{update.content}"
                                                    </p>
                                                )}
                                                {update.type === 'file' && (
                                                    <a
                                                        href={`/storage/${update.file_path}`}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-2 text-[#1F2BF3] font-bold hover:underline"
                                                    >
                                                        <DocumentIcon className="w-4 h-4" />
                                                        View attached resource
                                                    </a>
                                                )}
                                                {update.type === 'link' && (
                                                    <a
                                                        href={update.url}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-2 text-[#1F2BF3] font-bold hover:underline truncate max-w-md"
                                                    >
                                                        <LinkIcon className="w-4 h-4" />
                                                        {update.url}
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="md:border-l border-gray-100 dark:border-gray-800 md:pl-6 flex items-center justify-end">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Permanently remove this update?')) {
                                                        router.delete(route('member.progress.destroy', update.id));
                                                    }
                                                }}
                                                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Delete Update"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </DashboardCard>
                            </motion.div>
                        ))
                    )}
                </div>
            </DashboardPage>
        </MemberLayout>
    );
}
