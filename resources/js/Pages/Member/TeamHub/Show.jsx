import React from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';
import { ArrowLeft, FileText, MessageSquare, User, ExternalLink, Calendar } from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function TeamHubShow() {
    const { activity, auth } = usePage().props;

    if (!activity) return null;

    return (
        <MemberLayout auth={auth}>
            <Head title={`Activity: ${activity.title}`} />
            
            <DashboardPage 
                title="Activity Details" 
                description="View detailed information, shared files, and communications for this team activity."
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </DashboardButton>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Activity Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <DashboardCard className="p-8">
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="px-3 py-1 rounded-lg bg-[#1F2BF3]/10 text-[10px] font-black text-[#1F2BF3] uppercase tracking-widest border border-[#1F2BF3]/20">
                                        Team Activity
                                    </div>
                                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Calendar className="w-3.5 h-3.5 mr-2" />
                                        {new Date(activity.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                                    {activity.title}
                                </h1>

                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] p-8">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">
                                        Activity Content
                                    </label>
                                    <p className="text-base font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {activity.content}
                                    </p>
                                </div>
                            </div>
                        </DashboardCard>

                        {/* Files Section */}
                        {activity.files.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter ml-2 flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-[#1F2BF3]" />
                                    Shared Resources
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activity.files.map((file) => (
                                        <DashboardCard key={file.id} className="p-0 overflow-hidden group">
                                            <a
                                                href={`/storage/${file.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                    <img
                                                        src={`/storage/${file.file_path}`}
                                                        alt={file.file_name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <ExternalLink className="w-8 h-8 text-white drop-shadow-lg" />
                                                    </div>
                                                </div>
                                                <div className="p-4 flex items-center justify-between">
                                                    <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-wider truncate mr-4">
                                                        {file.file_name}
                                                    </p>
                                                    <DashboardButton variant="secondary" className="px-3 py-1.5 text-[9px]">
                                                        Open
                                                    </DashboardButton>
                                                </div>
                                            </a>
                                        </DashboardCard>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages Section */}
                        {activity.messages.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter ml-2 flex items-center gap-3">
                                    <MessageSquare className="w-6 h-6 text-[#1F2BF3]" />
                                    Activity Communications
                                </h2>
                                <div className="space-y-4">
                                    {activity.messages.map((msg) => (
                                        <DashboardCard key={msg.id} className="p-6" noHover>
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#1F2BF3] font-black">
                                                    {msg.user.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                                            {msg.user.name}
                                                        </p>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
                                                        {msg.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </DashboardCard>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Meta Information */}
                    <div className="space-y-8">
                        <DashboardCard className="p-6 bg-gradient-to-br from-[#1F2BF3] to-[#1F2BF3]/80 border-none text-white" noHover>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white/60">
                                Activity Ownership
                            </h3>
                            
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <User className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Created By</p>
                                    <p className="text-lg font-black uppercase tracking-tighter">{activity.admin.name}</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Participants</span>
                                    <span className="text-[11px] font-black uppercase tracking-tighter">Team Members</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Last Update</span>
                                    <span className="text-[11px] font-black uppercase tracking-tighter">
                                        {new Date(activity.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </DashboardCard>

                        <DashboardCard className="p-6 border-dashed border-2 border-gray-100 dark:border-gray-800 bg-transparent shadow-none" noHover>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Quick Navigation</h4>
                            <div className="space-y-3">
                                <Link href={route('member.teamhub.index')} className="block">
                                    <DashboardButton variant="secondary" className="w-full justify-start text-[10px]">
                                        Explore All Activities
                                    </DashboardButton>
                                </Link>
                                <Link href={route('member.teamhub.chat.admin', activity.admin.id)} className="block">
                                    <DashboardButton variant="secondary" className="w-full justify-start text-[10px]">
                                        Contact Admin
                                    </DashboardButton>
                                </Link>
                            </div>
                        </DashboardCard>
                    </div>
                </div>
            </DashboardPage>
        </MemberLayout>
    );
}



