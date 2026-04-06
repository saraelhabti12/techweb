import React, { useState } from 'react';
import { usePage, router, Head } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Attendance({ auth, attendanceData, selectedDate }) {
    const [date, setDate] = useState(selectedDate);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        router.get(route('member.attendance'), { date: newDate });
    };

    const StatusBadge = ({ status }) => {
        const base = "px-2 py-1 rounded-full text-xs font-medium";
        if (status === 'Present') return <span className={`${base} bg-green-100 text-green-800`}>Present</span>;
        if (status === 'Late') return <span className={`${base} bg-yellow-100 text-yellow-800`}>Late</span>;
        return <span className={`${base} bg-red-100 text-red-800`}>Absent</span>;
    };

    return (
        <AdminLayout auth={auth} title="Attendance">
            <Head title="Member Attendance" />

            <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                
                <div className="mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour
                </button>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Member Attendance</h1>
                        <p className="text-gray-600 dark:text-gray-400">Filter by day</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Date:</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={handleDateChange}
                            max={new Date().toISOString().split('T')[0]}
                            className="rounded-md border-gray-300 
                                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                       shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="bg-gray-200 bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                                    Member
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                                    Type
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 divide-y divide-gray-200 dark:divide-gray-700">
                            {attendanceData.map((item) => (
                                <tr key={`${item.user_id}-${item.date}`} className="hover:bg-purple-100/30 dark:hover:bg-purple-800/30 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                                        {new Date(item.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                                        {item.time}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                                        {item.type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
