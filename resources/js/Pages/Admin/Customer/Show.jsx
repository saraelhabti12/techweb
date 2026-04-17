import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from "react";
import ReplyModal from "./ReplyModal";
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function Show({ message, auth }) {
    const [replyOpen, setReplyOpen] = useState(false);

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Message Details"
                description={`Viewing message from ${message.full_name}`}
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()}>
                        Go Back
                    </DashboardButton>
                }
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    <DashboardCard>
                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{message.full_name}</h2>
                                <p className="text-sm text-gray-500 font-medium">Customer Inquiry</p>
                            </div>
                            <div className="flex items-center">
                                <DashboardButton onClick={() => setReplyOpen(true)} className="flex items-center gap-2">
                                    <EnvelopeIcon className="w-5 h-5" />
                                    Reply to Message
                                </DashboardButton>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="space-y-1">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</span>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <EnvelopeIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    <span className="font-medium">{message.email}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</span>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <PhoneIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    <span className="font-medium">{message.contact_number}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Company</span>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <BuildingOfficeIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    <span className="font-medium">{message.company_name || "—"}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Received Date</span>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <CalendarDaysIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    <span className="font-medium">{new Date(message.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Message Content</span>
                            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
                                    {message.message}
                                </p>
                            </div>
                        </div>

                        {message.services?.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Requested Services</span>
                                <div className="flex flex-wrap gap-2">
                                    {message.services.map((srv, i) => (
                                        <span key={i} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] rounded-xl text-xs font-bold">
                                            {srv}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </DashboardCard>
                </div>

                <ReplyModal
                    open={replyOpen}
                    onClose={() => setReplyOpen(false)}
                    customerEmail={message.email}
                />
            </DashboardPage>
        </AdminLayout>
    );
}
