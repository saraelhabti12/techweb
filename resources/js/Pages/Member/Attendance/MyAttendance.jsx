import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import moment from 'moment';
import { Head, Link } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';
import { Clock, CalendarCheck } from 'lucide-react';

export default function MyAttendance({ auth, attendance }) {
  return (
    <MemberLayout auth={auth}>
        <Head title="Attendance History" />
        
        <DashboardPage 
            title="Attendance History"
            description="Track your daily check-ins and check-outs at the studio."
            actions={
                <Link href="/member/attendance/qr">
                    <DashboardButton className="flex items-center gap-2">
                        <CalendarCheck className="w-5 h-5" />
                        Scan QR Code
                    </DashboardButton>
                </Link>
            }
        >
            <DashboardCard className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Activity Type</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {attendance.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">
                                        No attendance logs found for your account.
                                    </td>
                                </tr>
                            ) : (
                                attendance.map((entry, index) => (
                                    <motion.tr 
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    entry.type.toLowerCase() === 'check-in' 
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                                                        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                                                }`}>
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                                                    {entry.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {moment(entry.marked_at).format('MMMM Do YYYY, h:mm a')}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
                                                entry.type.toLowerCase() === 'check-in' 
                                                    ? 'bg-emerald-100 text-emerald-700' 
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                Success
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </DashboardCard>
        </DashboardPage>
    </MemberLayout>
  );
}
