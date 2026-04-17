import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilSquareIcon, TrashIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import DashboardPage from "@/Components/UI/DashboardPage";
import DashboardCard from "@/Components/UI/DashboardCard";
import DashboardButton from "@/Components/UI/DashboardButton";
import DashboardInput from "@/Components/UI/DashboardInput";

export default function DayView({ schedules, selectedDate, auth }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = schedules.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.person && item.person.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this schedule?")) {
            router.delete(`/admin/schedule/${id}`);
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title={`Schedules for ${dayjs(selectedDate).format('DD MMMM YYYY')}`} />
            
            <DashboardPage 
                title={dayjs(selectedDate).format('dddd, D MMMM')}
                description={`Daily schedule overview for ${dayjs(selectedDate).format('YYYY')}`}
                actions={
                    <div className="flex items-center gap-3">
                        <DashboardButton 
                            variant="secondary" 
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Back to Calendar
                        </DashboardButton>
                        <Link href="/admin/schedule/create">
                            <DashboardButton>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Schedule
                            </DashboardButton>
                        </Link>
                    </div>
                }
            >
                <div className="space-y-6">
                    <DashboardCard noHover>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                Scheduled Events
                            </h3>
                            <div className="w-full md:w-72">
                                <DashboardInput
                                    placeholder="Search events..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    icon={MagnifyingGlassIcon}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-8">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800/50">
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Event / Title</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Time</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Person</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Content</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
                                    {filtered.length > 0 ? (
                                        filtered.map((item) => (
                                            <tr key={item.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                                <td className="px-8 py-5">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors">
                                                        {item.title}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                                                        <ClockIcon className="w-4 h-4 text-[#1F2BF3]" />
                                                        {item.time ? item.time.slice(0, 5) : '--:--'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                                                        <UserIcon className="w-4 h-4 text-[#00D8C0]" />
                                                        {item.person || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                        {item.content || 'No description'}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link 
                                                            href={`/admin/schedule/${item.id}`}
                                                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] hover:bg-[#1F2BF3] hover:text-white transition-all shadow-sm"
                                                            title="View Details"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </Link>
                                                        <Link 
                                                            href={`/admin/schedule/${item.id}/edit`}
                                                            className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                                            title="Edit Event"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4" />
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                            title="Delete Event"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-12 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <CalendarIcon className="w-12 h-12 text-gray-200 dark:text-gray-800" />
                                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                                        No events scheduled for this day
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </DashboardCard>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}
