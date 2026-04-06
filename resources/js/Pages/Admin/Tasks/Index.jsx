import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Index({ tasks, auth, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('tasks.index'), { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get(route('tasks.index'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout auth={auth} header="Tasks Management">
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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-700">Tasks Overview</h1>
                    <Link
                        href="tasks/create"
                        className="inline-flex items-center px-4 py-2 
                                    bg-purple-600 border border-transparent rounded-md 
                                    font-semibold text-xs text-white uppercase tracking-widest 
                                    hover:bg-purple-700 active:bg-purple-900 
                                    focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                                    disabled:opacity-25 transition 
                                    dark:bg-purple-700 dark:hover:bg-purple-600"
                    >
                        + New Task
                    </Link>
                </div>

                <div className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <MagnifyingGlassIcon className="h-5 w-5 text-purple-500 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Search Tasks</h3>
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
                                placeholder="Search tasks by title, description, project, or assigned user..."
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

                <div className="overflow-x-auto rounded-lg shadow-sm bg-gray-200 bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-6">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead  className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                            <tr >
                                <th className="px-4 py-2 border-b border-purple-200">Title</th>
                                <th className="px-4 py-2 border-b border-purple-200">Project</th>
                                <th className="px-4 py-2 border-b border-purple-200">Assigned To</th>
                                <th className="px-4 py-2 border-b border-purple-200">Status</th>
                                <th className="px-4 py-2 border-b border-purple-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                            {tasks.map((task) => (
                                <tr key={task.id} >
                                    <td className="px-6 py-4 border-b border-purple-200 font-medium text-purple-700">{task.title}</td>
                                    <td className="px-4 py-2 border-b border-purple-200">{task.project?.name}</td>
                                    <td className="px-4 py-2 border-b border-purple-200">{task.user?.name}</td>
                                    <td className="px-4 py-2 border-b border-purple-200 capitalize">
                                        <span className="px-2 py-1 bg-gray-100 text-purple-700 rounded-full text-xs font-semibold">
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border-b border-purple-200 flex space-x-2">
                                        <Link
                                            href={route('tasks.show', task.id)}
                                            className="text-purple-600 hover:text-purple-700 font-medium text-sm transition"
                                        >
                                            Details
                                        </Link>
                                        <Link
                                            href={route('tasks.edit', task.id)}
                                            className="text-purple-600 hover:text-purple-800 font-medium text-sm transition"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this task?")) {
                                                    router.delete(route('tasks.destroy', task.id));
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm transition"
                                        >
                                            Delete
                                        </button>
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

