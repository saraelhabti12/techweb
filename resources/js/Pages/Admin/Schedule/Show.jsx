import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UserIcon, DocumentTextIcon, HashtagIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import dayjs from "dayjs";
import DashboardPage from "@/Components/UI/DashboardPage";
import DashboardCard from "@/Components/UI/DashboardCard";
import DashboardButton from "@/Components/UI/DashboardButton";

export default function Show({ schedule, auth }) {
    const formattedDate = schedule.date 
        ? dayjs(schedule.date).format("MMMM D, YYYY") 
        : "Not set";
    const formattedTime = schedule.time || "Not set";

    const details = [
        { label: "Date", value: formattedDate, icon: <CalendarIcon className="w-5 h-5" /> },
        { label: "Time", value: formattedTime, icon: <ClockIcon className="w-5 h-5" /> },
        { label: "Person", value: schedule.person || "Not specified", icon: <UserIcon className="w-5 h-5" /> },
        { label: "Content", value: schedule.content || "No description", icon: <DocumentTextIcon className="w-5 h-5" /> },
        { label: "Reference ID", value: `#${schedule.id}`, icon: <HashtagIcon className="w-5 h-5" /> },
        { label: "Created", value: dayjs(schedule.created_at).format("YYYY-MM-DD HH:mm"), icon: <ShieldCheckIcon className="w-5 h-5" /> },
        { label: "Last Updated", value: dayjs(schedule.updated_at).format("YYYY-MM-DD HH:mm"), icon: <ShieldCheckIcon className="w-5 h-5" /> },
    ];

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Schedule Details" 
                description={`Viewing details for: ${schedule.title}`}
                actions={
                    <DashboardButton 
                        variant="secondary" 
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to List
                    </DashboardButton>
                }
            >
                <div className="max-w-4xl mx-auto">
                    <DashboardCard>
                        <div className="mb-8 pb-6 border-b border-gray-100 dark:border-gray-800/50">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                {schedule.title}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {details.map((detail, index) => (
                                <div key={index} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 group hover:border-[#1F2BF3] transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-white dark:bg-gray-900 text-[#1F2BF3] shadow-sm">
                                            {detail.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {detail.label}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white pl-11">
                                        {detail.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}









