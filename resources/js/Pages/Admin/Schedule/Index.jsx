import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

export default function Index({ schedules: initialSchedules, auth }) {
    const [schedules, setSchedules] = useState(initialSchedules);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this schedule?")) {
            router.delete(`/admin/schedule/${id}`, {
                onSuccess: () => {
                    setSchedules((prev) => prev.filter((item) => item.id !== id));
                },
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/schedule', { search: searchTerm }, { preserveScroll: true });
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get('/admin/schedule', {}, { preserveScroll: true });
    };

    // 🔥 Date du jour
    const today = dayjs().format('YYYY-MM-DD');

    return (
        <AdminLayout auth={auth} title="All Schedule">
            <Head title="All Schedule" />
            <div className="mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour
                </button>
            </div>

            <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">All Schedules</h2>
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

                {/* Search Section */}
                <div className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Search Schedule</h3>
                        </div>
                        <button
                            onClick={clearSearch}
                            className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Clear Search
                        </button>
                    </div>
                    <form onSubmit={handleSearch} className="flex space-x-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search schedules by title, person or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm pl-9
                                        focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 
                                    bg-purple-600 border border-transparent rounded-md 
                                    font-semibold text-xs text-white uppercase tracking-widest 
                                    hover:bg-purple-700 active:bg-purple-900 
                                    focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                                    disabled:opacity-25 transition 
                                    dark:bg-purple-700 dark:hover:bg-purple-600"
                        >
                            <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                            Search
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-gray-200 bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-6">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Person</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Content</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                            {schedules.length > 0 ? (
                                schedules.map((item) => {
                                    const isToday = item.date && dayjs(item.date).format('YYYY-MM-DD') === today;
                                    const textClass = isToday
                                        ? 'text-purple-600 dark:text-purple-400 font-semibold'
                                        : 'text-gray-900 dark:text-gray-100';

                                    return (
                                        <tr key={item.id}>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}>{item.title}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}>
                                                {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}>
                                                {item.time ? item.time.slice(0, 5) : '-'}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}>
                                                {item.person || '-'}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}>
                                                {item.content || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <Link href={`/admin/schedule/${item.id}`} className="text-blue-500 hover:underline">Details</Link>
                                                <Link href={`/admin/schedule/${item.id}/edit`} className="text-yellow-500 hover:underline">Edit</Link>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-4 text-gray-500 dark:text-gray-400">No schedules available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}






