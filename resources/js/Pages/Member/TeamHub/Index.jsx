import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';
import { ArrowLeft, Layout, FileText, ChevronRight, Inbox } from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function TeamHubIndex() {
    const { activities = [], auth } = usePage().props;

    return (
        <MemberLayout auth={auth}>
            <DashboardPage 
                title="Team Hub" 
                description="Explore activities, collaborated files, and team updates assigned to you."
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </DashboardButton>
                }
            >
                {!activities || activities.length === 0 ? (
                    <DashboardCard className="p-16 text-center" noHover>
                        <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center mx-auto mb-6">
                            <Inbox className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
                            No activities yet
                        </h3>
                        <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto">
                            When your administrators assign activities or share files with you, they will appear here.
                        </p>
                    </DashboardCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activities.map(activity => (
                            <DashboardCard
                                key={activity?.id || Math.random()}
                                className="flex flex-col h-full"
                            >
                                <div className="p-2 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3]">
                                            <Layout className="w-6 h-6" />
                                        </div>
                                        <div className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-gray-700">
                                            Activity
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-3 leading-tight">
                                        {activity?.title || 'Untitled Activity'}
                                    </h2>
                                    
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-6">
                                        {activity?.content ? activity.content : 'No detailed description available for this activity.'}
                                    </p>
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <FileText className="w-3.5 h-3.5 mr-2 text-[#1F2BF3]" />
                                        {activity?.files?.length || 0} Files
                                    </div>
                                    
                                    {activity?.id && (
                                        <Link href={route('member.teamhub.show', activity.id)}>
                                            <DashboardButton variant="secondary" className="px-4 py-2 text-[9px]">
                                                View <ChevronRight className="w-3 h-3 ml-1" />
                                            </DashboardButton>
                                        </Link>
                                    )}
                                </div>
                            </DashboardCard>
                        ))}
                    </div>
                )}
            </DashboardPage>
        </MemberLayout>
    );
}

