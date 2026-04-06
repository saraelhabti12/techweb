import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Index({ blogs, auth }) {
    return (
        <AdminLayout auth={auth} header="Blogs Management">
            <div className="max-w-4xl mx-auto p-6 bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg shadow-md space-y-4">
                <div className="mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour
                </button>
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                    All Blogs
                </h1>

                {blogs.length === 0 ? (
                    <div className="text-center text-gray-400 py-6">
                        No blogs found.
                    </div>
                ) : (
                    blogs.map(blog => (
                        <div 
                            key={blog.id} 
                            className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
                        >
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                                {blog.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                {blog.excerpt}
                            </p>

                            <Link 
                                href={`/admin/blogs/${blog.id}`} 
                                className="inline-block text-purple-600 hover:text-purple-800 font-medium transition"
                            >
                                View →
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}



