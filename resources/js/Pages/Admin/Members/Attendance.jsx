import React, { useState } from 'react';
import { usePage, router, Head } from '@inertiajs/react';
import { CalendarDaysIcon, UserCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import { motion } from 'framer-motion';

export default function Attendance({ auth, attendanceData, selectedDate }) {
    const [date, setDate] = useState(selectedDate);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        router.get(route('admin.members.attendance'), { date: newDate });
    };

    const StatusBadge = ({ status }) => {
        const base = "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm";
        if (status === 'Present') return <span className={`${base} bg-emerald-100 text-emerald-700`}>Present</span>;
        if (status === 'Late') return <span className={`${base} bg-amber-100 text-amber-700`}>Late</span>;
        return <span className={`${base} bg-red-100 text-red-700`}>Absent</span>;
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Team Attendance" />

            <DashboardPage 
                title="Team Attendance"
                description="Monitor daily presence and punctuality of all team members."
                actions={
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-4 py-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filter Date:</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={handleDateChange}
                            max={new Date().toISOString().split('T')[0]}
                            className="bg-transparent border-none p-0 text-sm font-bold text-[#1F2BF3] focus:ring-0 cursor-pointer"
                        />
                    </div>
                }
            >
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Team Member</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Activity Info</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {attendanceData.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic font-medium">
                                            No logs recorded for this selected date.
                                        </td>
                                    </tr>
                                ) : (
                                    attendanceData.map((item) => (
                                        <motion.tr 
                                            key={`${item.user_id}-${item.date}-${item.time}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1F2BF3] group-hover:scale-110 transition-transform">
                                                        <UserCircleIcon className="w-6 h-6" />
                                                    </div>
                                                    <span className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tighter">{item.type}</span>
                                                    <span className="text-[10px] font-medium text-gray-400">{new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm font-black text-gray-600 dark:text-gray-400">
                                                    <ClockIcon className="w-4 h-4 text-[#1F2BF3]" />
                                                    {item.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <StatusBadge status={item.status} />
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
