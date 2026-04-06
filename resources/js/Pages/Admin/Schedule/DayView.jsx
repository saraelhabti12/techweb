import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function DayView({ schedules, selectedDate, auth }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = schedules.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.person && item.person.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = (id) => {
        if (confirm("Delete this schedule?")) {
            router.delete(`/admin/schedule/${id}`);
        }
    };

    return (
        <AdminLayout auth={auth} title={`Schedules for ${dayjs(selectedDate).format('DD MMMM YYYY')}`}>
            <Head title={`Schedules for ${dayjs(selectedDate).format('DD MMMM YYYY')}`} />

            <div className="mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Calendar
                </button>
            </div>
            <div className="flex justify-end mb-6">
                <Link
                    href="/admin/schedule/create"
                    className="inline-flex items-center px-4 py-2 
                        bg-purple-600 border border-transparent rounded-md 
                        font-semibold text-xs text-white uppercase tracking-widest 
                        hover:bg-purple-700 active:bg-purple-900 
                        focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                        disabled:opacity-25 transition 
                        dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                    Add Schedule
                </Link>
            </div>

            <div className="bg-gray-200 bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Events on {dayjs(selectedDate).format('dddd, DD MMMM YYYY')}
                    </h2>
                    <div className="relative w-64">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                    dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                    shadow-sm pl-9
                                    focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Person</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Content</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30">
                        {filtered.length > 0 ? (
                            filtered.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {item.time ? item.time.slice(0, 5) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.person || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.content || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link href={`/admin/schedule/${item.id}`} className="text-blue-500 hover:underline">Details</Link>
                                        <Link href={`/admin/schedule/${item.id}/edit`} className="text-yellow-500 hover:underline">Edit</Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4 text-gray-500 dark:text-gray-400">
                                    No events for this day
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
