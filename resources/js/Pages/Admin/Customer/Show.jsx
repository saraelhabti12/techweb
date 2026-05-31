import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from "react";
import ReplyModal from "./ReplyModal";
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function Show({ message, selectedCreators = [], auth }) {
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

                        {message.needs_creator && (
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Requested Creators</span>
                                {selectedCreators.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {selectedCreators.map((creator) => (
                                            <div key={creator.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                                                <img src={`/storage/${creator.profile_photo}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={creator.display_name} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{creator.display_name}</p>
                                                    <p className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">{creator.city}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-2xl">
                                        <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-widest">
                                            Client requested creator assistance but haven't selected specific ones yet.
                                        </p>
                                    </div>
                                )}
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
