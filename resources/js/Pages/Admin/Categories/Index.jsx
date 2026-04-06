import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link, router } from '@inertiajs/react';

export default function Index({ categories, auth }) {
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            router.delete(route('categories.destroy', id));
        }
    };

    return (
        <AdminLayout auth={auth} header="Categories Management">
            <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Retour
                    </button>
                    </div>
                    
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">All Categories</h1>
                    <Link
                        href={route('categories.create')}
                        className="inline-flex items-center px-4 py-2 
                                   bg-purple-600 border border-transparent rounded-md 
                                   font-semibold text-xs text-white uppercase tracking-widest 
                                   hover:bg-purple-700 active:bg-purple-900 
                                   focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                                   disabled:opacity-25 transition 
                                   dark:bg-purple-700 dark:hover:bg-purple-600"
                    >
                        + Add Category
                    </Link>
                </div>
                {categories.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-gray-200/30 dark:bg-gray-800/30 rounded-lg">
                        No categories found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-gray-200 bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 
                                           rounded-lg p-6 border border-purple-200/50 dark:border-purple-500/20 
                                           shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex flex-col justify-between h-full">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            {category.name}
                                        </h2>
                                        <p className="text-sm text-gray-900 dark:text-gray-400">
                                            Category ID: {category.id}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4">
                                        <Link
                                            href={route('categories.edit', category.id)}
                                            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
