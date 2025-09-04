import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function Index({ categories, auth }) {
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            router.delete(route('categories.destroy', id));
        }
    };

    return (
        <AdminLayout auth={auth} header="Categories Management">
            <div className="max-w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-cyan-300">Categories</h1>
                    <Link
                        href={route('categories.create')}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded transition-colors"
                    >
                        + Add Category
                    </Link>
                </div>

                {categories.length === 0 ? (
                    <div className="w-full text-center text-gray-400 py-4">
                        No categories found.
                    </div>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="text-xl font-bold text-cyan-300 mb-4">{category.name}</div>
                            <div className="space-x-4">
                                <Link
                                    href={route('categories.edit', category.id)}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
