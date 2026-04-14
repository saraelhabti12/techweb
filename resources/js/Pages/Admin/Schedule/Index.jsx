import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardInput from '@/Components/UI/DashboardInput';
import { motion } from 'framer-motion';

export default function Index({ schedules: initialSchedules, auth }) {
    const [schedules, setSchedules] = useState(initialSchedules);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this schedule?")) {
            router.delete(route('admin.schedule.destroy', id), {
                onSuccess: () => {
                    setSchedules((prev) => prev.filter((item) => item.id !== id));
                },
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.schedule.index'), { search: searchTerm }, { preserveScroll: true });
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get(route('admin.schedule.index'), {}, { preserveScroll: true });
    };

    const today = dayjs().format('YYYY-MM-DD');

    return (
        <AdminLayout auth={auth}>
            <Head title="Schedules" />
            
            <DashboardPage 
                title="Planning & Schedules"
                description="Coordinate your team's timeline and manage important studio events."
                actions={
                    <div className="flex gap-3">
                        <Link href={route('admin.appointments.calendar')}>
                            <DashboardButton variant="secondary" className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5" />
                                View Calendar
                            </DashboardButton>
                        </Link>
                        <Link href={route('admin.schedule.create')}>
                            <DashboardButton className="flex items-center gap-2">
                                <PlusIcon className="w-5 h-5" />
                                Add Schedule
                            </DashboardButton>
                        </Link>
                    </div>
                }
            >
                {/* Search Header */}
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="p-6 bg-gray-50/50 dark:bg-gray-900/20">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <DashboardInput 
                                    icon={MagnifyingGlassIcon}
                                    placeholder="Search schedules by title, person or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <DashboardButton type="submit">Search</DashboardButton>
                                {searchTerm && (
                                    <DashboardButton variant="secondary" onClick={clearSearch}>Reset</DashboardButton>
                                )}
                            </div>
                        </form>
                    </div>
                </DashboardCard>

                {/* Table Card */}
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Scheduled Event</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date & Time</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Person In Charge</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {schedules.length > 0 ? (
                                    schedules.map((item) => {
                                        const isToday = item.date && dayjs(item.date).format('YYYY-MM-DD') === today;
                                        return (
                                            <motion.tr 
                                                key={item.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className={`group transition-colors ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className={`font-bold text-base ${isToday ? 'text-[#1F2BF3]' : 'text-gray-900 dark:text-white'}`}>
                                                            {item.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">{item.content || 'No details provided'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                            {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                                        </span>
                                                        <span className="text-[10px] font-black text-[#1F2BF3] uppercase tracking-tighter">
                                                            {item.time ? item.time.slice(0, 5) : 'All Day'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase">
                                                            {item.person?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.person || 'Unassigned'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {isToday ? (
                                                        <span className="px-2.5 py-1 bg-[#1F2BF3] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Today</span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Upcoming</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={route('admin.schedule.show', item.id)}>
                                                            <button className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] hover:bg-[#1F2BF3] hover:text-white transition-all shadow-sm">
                                                                <EyeIcon className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <Link href={route('admin.schedule.edit', item.id)}>
                                                            <button className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                                <PencilIcon className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">No schedules found matching your criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
