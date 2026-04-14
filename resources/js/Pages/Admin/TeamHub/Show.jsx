import React from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { 
    UserCircleIcon, 
    CalendarIcon, 
    FolderIcon, 
    ChatBubbleLeftRightIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Show({ item, auth }) {
  if (!item) {
      return (
          <AdminLayout auth={auth}>
              <DashboardPage title="Activity Not Found">
                  <DashboardCard>
                      <p>The requested activity could not be found.</p>
                      <Link href={route('admin.teamhub.index')}>
                          <DashboardButton className="mt-4">Back to Activities</DashboardButton>
                      </Link>
                  </DashboardCard>
              </DashboardPage>
          </AdminLayout>
      );
  }

  const formattedDate = item.created_at 
    ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Unknown Date';

  return (
    <AdminLayout auth={auth}>
        <DashboardPage 
            title={item.title || 'Untitled Activity'}
            description={`Launched by ${item.admin?.name || 'Administrator'} • ${formattedDate}`}
            actions={
                <div className="flex gap-3">
                    <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                        Back to Activity
                    </DashboardButton>
                    <Link href={route('admin.teamhub.edit', item.id)}>
                        <DashboardButton className="flex items-center gap-2">
                            <PencilIcon className="w-4 h-4" />
                            Manage Activity
                        </DashboardButton>
                    </Link>
                </div>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content & Files */}
                <div className="lg:col-span-2 space-y-8">
                    <DashboardCard className="border-transparent shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[#1F2BF3]">
                                <FolderIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Briefing & Assets</h3>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 mb-8">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-line italic">
                                "{item.content || 'No content available.'}"
                            </p>
                        </div>

                        {item.files && item.files.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {item.files.map((file) => (
                                    <div key={file.id} className="group relative rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                                        {file.file_path && file.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <div className="aspect-video">
                                                <img
                                                    src={`/storage/${file.file_path}`}
                                                    alt={file.file_name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-video flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
                                                <FolderIcon className="w-12 h-12 text-gray-300 mb-2" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document File</span>
                                            </div>
                                        )}
                                        <div className="p-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{file.file_name}</span>
                                            <div className="flex gap-2">
                                                <a href={`/storage/${file.file_path}`} target="_blank" className="p-2 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] rounded-lg">
                                                    <EyeIcon className="w-4 h-4" />
                                                </a>
                                                <a href={`/storage/${file.file_path}`} download className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                                <p className="text-gray-400 font-medium italic">No visual assets attached to this hub activity.</p>
                            </div>
                        )}
                    </DashboardCard>
                </div>

                {/* Sidebar: Collaborators & Timeline */}
                <div className="space-y-8">
                    <DashboardCard className="border-transparent shadow-lg h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600">
                                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Recent Discussion</h3>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {item.messages && item.messages.length > 0 ? (
                                item.messages.map((m) => (
                                    <div key={m.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-[#1F2BF3] uppercase tracking-widest">{m.user?.name}</span>
                                            <span className="text-[10px] font-bold text-gray-400">{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                            {m.message}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No messages yet</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                            <Link href={route('chat.index')}>
                                <DashboardButton variant="secondary" className="w-full text-xs !py-3">
                                    Open Full Discussion Hub
                                </DashboardButton>
                            </Link>
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </DashboardPage>
    </AdminLayout>
  );
}
