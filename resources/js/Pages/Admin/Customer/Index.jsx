import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, router } from '@inertiajs/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Index({ messages, unreadCount, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.customers.index'), { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get(route('admin.customers.index'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout title="Customer Messages" messages={messages} unreadCount={unreadCount}>
            <div className="max-w-7xl mx-auto p-6 bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg">
                <div className="mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour
                </button>
                </div>
                <h1 className="text-2xl font-bold mb-6 text-purple-700">All Messages</h1>
                <div className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center ">
                            <MagnifyingGlassIcon className="h-5 w-5 text-purple-500 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Search Customer Messages</h3>
                        </div>
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSearch} className="flex space-x-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, company, or message content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center space-x-2 transition duration-200"
                        >
                            <MagnifyingGlassIcon className="h-4 w-4" />
                            <span>Search</span>
                        </button>
                    </form>
                    {searchTerm && (
                        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                                <strong>Search Results for:</strong> "{searchTerm}"
                            </p>
                        </div>
                    )}
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.map(msg => (
                        <li
                            key={msg.id}
                            className={`border-l-4 rounded-lg shadow-sm p-5 transition-all duration-200 hover:shadow-md
                                ${msg.is_read ? 'border-purple-100 bg-gray-100 bg-opacity-30 dark:bg-gray-700 bg-opacity-30 text-gray-600' : 'border-purple-600 bg-white dark:bg-gray-800 font-semibold text-gray-900 dark:text-white'}
                            `}
                        >
                            <Link href={route('admin.customers.show', msg.id)} className="block">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg text-gray-900">{msg.full_name}</span>
                                    <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-900 dark:text-gray-300 line-clamp-3">{msg.message}</p>
                                <span className={`mt-2 inline-block text-xs font-medium px-2 py-1 rounded-full
                                    ${msg.is_read ? ' text-purple-700' : ' text-white'}
                                `}>
                                    {msg.is_read ? 'Read' : 'Unread'}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </AdminLayout>
    );
}

