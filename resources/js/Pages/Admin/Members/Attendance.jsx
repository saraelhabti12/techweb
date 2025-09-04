import React, { useState } from 'react';
import { usePage, router, Head } from '@inertiajs/react';
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

            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white shadow rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Member Attendance</h1>
                            <p className="text-gray-500">Filter by day</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="date" className="text-sm font-medium text-gray-600">Select Date:</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={handleDateChange}
                                max={new Date().toISOString().split('T')[0]}
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white shadow rounded-xl">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left px-6 py-3">Member</th>
                                <th className="text-left px-6 py-3">Date</th>
                                <th className="text-left px-6 py-3">Time</th>
                                <th className="text-left px-6 py-3">Status</th>
                                <th className="text-left px-6 py-3">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {attendanceData.map((item) => (
                                <tr key={`${item.user_id}-${item.date}`}>
                                    <td className="px-6 py-4">{item.name}</td>
                                    <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{item.time}</td>
                                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                    <td className="px-6 py-4">{item.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
